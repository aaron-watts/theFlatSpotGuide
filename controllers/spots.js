const Spot = require('../models/spot');
const Event = require('../models/event');
const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { monthArray } = require('../utils/data');
const { haversine } = require('../utils/haversine')
const { updateFollowers } = require('../utils/middleware');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const { author } = req.query;
    console.log(!(!req.user))
    let spots;

    if (author) {
        // redirect if not correct user
        if (!req.isAuthenticated() || req.user && !req.user.equals(author)) {
            res.redirect('/spots');
        }

        // find only current users events
        spots = await Spot.find({ author })
            .populate({
                path: 'events',
                match: { date: { $gt: new Date() } },
                options: {
                    sort: { date: 1 }
                }
            })
            .populate('author');

    } else {
        // find all events
        spots = await Spot.find({})
            .populate({
                path: 'events',
                match: { date: { $gt: new Date() } },
                options: {
                    sort: { date: 1 }
                }
            })
            .populate('author');
    }

    // if user is signed in sort by distance from users location
    if (!(!req.user)) {
        const user = req.user;
        // (lat1, lon1, lat2, lon2)
        spots.sort(function (a, b) {
            return haversine(
                    a.geometry.coordinates[0],a.geometry.coordinates[1],
                    user.geometry.coordinates[0],user.geometry.coordinates[1]
                ) 
                - haversine(
                    b.geometry.coordinates[0],b.geometry.coordinates[1],
                    user.geometry.coordinates[0],user.geometry.coordinates[1]
                )   
        })
        console.log(spots[0].name)
    }

    res.render('spots/index', { spots });
}

module.exports.newForm = (req, res) => {
    res.render('spots/new');
}

module.exports.show = async (req, res) => {
    const spot = await Spot.findById(req.params.id)
        .populate({
            path: 'events',
            populate: {
                path: 'author'
            },
            match: { date: { $gt: new Date() } },
            options: {
                sort: { date: 1 }
            }
        })
        .populate('author');

    if (!spot) res.status(404).render('404notfound');

    res.render('spots/show', { spot, monthArray });
}

module.exports.editForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', { spot });
}

module.exports.create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.spot.location,
        limit: 1
    }).send()

    const spot = new Spot(req.body.spot);

    // append geometry to spot
    spot.geometry = geoData.body.features[0].geometry;

    // map files from multer files object in req.body
    spot.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    // got user ID from session cookie
    spot.author = req.user._id;

    // add author to following
    spot.following.push(req.user._id);
    spot.events.push(spot);

    await spot.save();

    req.flash('success', 'New Spot Created!')
    res.redirect('/spots');
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const updateSpot = req.body.spot;
    const spot = await Spot.findById(id)
        .populate('author')
        .populate('following');

    if (updateSpot.coordinates) {
        const spotLatLon = updateSpot.coordinates.split(',');
        spot.geometry.coordinates.splice(0, 2, parseFloat(spotLatLon[1]), parseFloat(spotLatLon[0]));
        spot.customLatLon = true;
    }
    if (!updateSpot.coordinates && !spot.customLatLon && updateSpot.location !== spot.location) {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.spot.location,
            limit: 1
        }).send()

        // append geometry to spot
        spot.geometry = geoData.body.features[0].geometry;
    }

    // map files from multer files object in req.body
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    spot.images.push(...imgs);

    spot.name = updateSpot.name;
    spot.location = updateSpot.location;
    spot.details = updateSpot.details;

    await spot.save();

    // delete slected images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    // only allow 2 images, delete excess
    if (spot.images.length > 2) {
        const toDelete = [];
        for (let i = 2; i < spot.images.length; i++) {
            await cloudinary.uploader.destroy(spot.images[i].filename);
            toDelete.push(spot.images[i].filename)
        }
        await spot.updateOne({ $pull: { images: { filename: { $in: toDelete } } } });
    }

    // notify followers if not author
    const notification = `<strong>${spot.name}</strong> spot has been changed! 
        <a class="text-decoration-none" href="/spots/${spot._id}">Go to Spot</a>`
    updateFollowers(spot, spot, notification);

    res.redirect(`/spots/${id}`);
}

module.exports.delete = async (req, res) => {
    const spot = await Spot.findById(req.params.id)
        .populate('events')
        .populate('images');

    // delete associated images
    if (spot.images.length) {
        for (let image of spot.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }

    // delete associated events
    if (spot.events.length) {
        for (let event of spot.events) {
            await event.delete();
        }
    }

    await spot.delete();

    res.redirect('/spots');
}

module.exports.follow = async (req, res) => {
    const user = req.user._id;
    const spot = await Spot.findById(req.params.id);

    if (!spot.following.some(i => i.equals(user))) {
        // add user to spots following list
        spot.following.push(user);
        await spot.save();

        // notify author of new follow if not author
        const author = await User.findById(spot.author);
        const username = await User.findById(user);
        if (!author.equals(user)) {
            author.notifications.push({
                text: `<strong>${username.username}</strong> followed <strong>${spot.name}</strong> spot!`,
                status: 'new',
                timestamp: new Date()
            });
            await author.save()
        }

        res.send({ following: true, total: spot.following.length });
    } else {
        // remove user from spot following list
        spot.following.pull(user);
        await spot.save();

        res.send({ following: false, total: spot.following.length });
    }
}
