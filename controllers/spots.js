const Spot = require('../models/spot');
const Event = require('../models/event');
const User = require('../models/user')
const { monthArray } = require('../utils/data');

module.exports.index = async (req, res) => {
    //console.log(req.originalUrl)
    const spots = await Spot.find({})
        .populate({
            path: 'events',
            match: { date: { $gt: new Date() } },
            options: {
                sort: { date: 1 }
            }
        })
        .populate('author');
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
    res.render('spots/show', { spot, monthArray });
}

module.exports.editForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', { spot });
}

module.exports.create = async (req, res) => {
    const spot = new Spot(req.body.spot)
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
    //const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot })
    const spot = await Spot.findById(id)
        .populate('author')
        .populate('following');

    const newDetails = {
        name: updateSpot.name,
        location: updateSpot.location,
        details: updateSpot.details
    }
    const edited = await Spot.findByIdAndUpdate(id, {...newDetails});
    const newSpot = await edited.save();

    console.log(spot.following)
    // notify followers if not author
    for (follower of spot.following) {
        const user = await User.findById(follower._id);

        if (!spot.author.equals(user)) {
            user.notifications.push({
                text: `<strong>${newSpot.name}</strong> spot has been changed! 
                <a class="text-decoration-none" href="/spots/${newSpot._id}">Go to Spot</a>`,
                status: 'new',
                timestamp: new Date()
            })
            user.save();
        }
    }

    res.redirect(`/spots/${id}`);
}

module.exports.delete = async (req, res) => {
    const spot = await Spot.findByIdAndDelete(req.params.id);
    res.redirect('/spots');
}

module.exports.follow = async (req, res) => {
    const user = req.user._id;
    const spot = await Spot.findById(req.params.id);
    // if(!spot.following.some(i => i.equals(user))) {
    //     spot.following.push(user);
    //     await spot.save();
    //     res.send({following: true, total: spot.following.length});
    // } else {
    //     spot.following.pull(user);
    //     await spot.save();
    //     res.send({following: false, total: spot.following.length});
    // }

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
