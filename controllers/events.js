const Spot = require('../models/spot');
const Event = require('../models/event');
const User = require('../models/user');
const { monthArray } = require('../utils/data');
const { findByIdAndRemove, findByIdAndUpdate } = require('../models/spot');

module.exports.index = async (req, res) => {
    const events = await Event.find({ 'date': { '$gte': new Date() } })
        .sort({ 'date': 1 })
        .populate('spot')
        .populate('author')
        .populate('following');

    res.render('events/index', { events, monthArray });
}

module.exports.newForm = async (req, res) => {
    const spots = await Spot.find();
    res.render('events/new', { spots });
}

module.exports.editForm = async (req, res) => {
    const event = await Event.findById(req.params.eventId)
        .populate('spot');
    const spots = await Spot.find();

    res.render('events/edit', { event, spots });
}

module.exports.addToSpot = async (req, res) => {
    const { spotId } = req.params
    const { event } = req.body;
    const spot = await Spot.findById(spotId)
        .populate('following')
        .populate('author');

    const newEvent = new Event({
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
            parseInt(event.hours), parseInt(event.minutes)),
        title: event.title,
        description: event.description,
        spot: spotId
    })

    // add author to following
    newEvent.author = req.user._id;
    newEvent.following.push(req.user._id);
    spot.events.push(newEvent);

    await newEvent.save();
    await spot.save();

    // update spot followers of new event
    for (follower of spot.following) {
        const user = await User.findById(follower._id);
        if (!spot.author.equals(user)) {
            user.notifications.push({
                text: `<strong>${req.user.username}</strong> pinned an event to <strong>${spot.name}</strong>! 
                    <a class="text-decoration-none" href="/spots/${spot._id}">Go to event</a>`,
                status: 'new',
                timestamp: new Date()
            })
            user.save();
        }
    }

    req.flash('success', 'Event Added!')
    res.redirect(`/spots/${spotId}`);
}

module.exports.create = async (req, res) => {
    const { event } = req.body;
    const spot = await Spot.findOne({ name: event.spot })
        .populate('following')
        .populate('author');

    const newEvent = new Event({
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
            parseInt(event.hours), parseInt(event.minutes)),
        title: event.title,
        description: event.description,
        spot
    })

    // add author to event followers
    newEvent.author = req.user._id;
    newEvent.following.push(req.user._id);
    spot.events.push(newEvent);

    await newEvent.save();
    await spot.save();

    // update spot followers of new event
    console.log(newEvent.author)
    for (follower of spot.following) {
        const user = await User.findById(follower._id);
        console.log(user)

        if (!spot.author.equals(user)) {
            user.notifications.push({
                text: `An event has been pinned to <strong>${spot.name}</strong>! 
                <a class="text-decoration-none" href="/spots/${spot._id}">Go to spot</a>`,
                status: 'new',
                timestamp: new Date()
            })
            user.save();
        }
    }

    req.flash('success', 'Event Added!')
    res.redirect(`/events`);
}

module.exports.update = async (req, res) => {
    const { eventId, spotId } = req.params;
    const { event } = req.body
    const updateEvent = await Event.findById(eventId)
        .populate('spot')
        .populate('author')
        .populate('following');
    const spot = await Spot.findOne({ name: event.spot })
        .populate('following')
        .populate('author');

    updateEvent.title = event.title;
    updateEvent.date = new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
        parseInt(event.hours), parseInt(event.minutes));
    updateEvent.description = event.description;
    updateEvent.spot = spot;

    if (!spot.equals(spotId)) {
        //await Spot.findByIdAndUpdate(spotId, { $pull: { events: eventId } });
        const oldSpot = await Spot.findById(spotId)
            .populate('author')
            .populate('following');
        await oldSpot.events.pull(eventId);
        await spot.events.push(updateEvent);
        await oldSpot.save();
        await spot.save();

        // notify spot followers if not author
        for (follower of spot.following) {
            if (!spot.author.equals(follower._id)) {
                const user = await User.findById(follower._id);
                user.notifications.push({
                    text: `<strong>${updateEvent.title}</strong> was relocated to <strong>${spot.name}</strong>! 
                <a class="text-decoration-none" href="/spots/${spot._id}">Go to Spot</a>`,
                    status: 'new',
                    timestamp: new Date()
                })
                user.save();
            }
        }

        // notify followers of old spot
        for (follower of oldSpot.following) {
            if (!spot.author.equals(follower._id)) {
                const user = await User.findById(follower._id);
                user.notifications.push({
                    text: `<strong>${updateEvent.title}</strong> was relocated from <strong>${oldSpot.name}</strong>! 
                <a class="text-decoration-none" href="/spots/${spot._id}">Go to Event</a>`,
                    status: 'new',
                    timestamp: new Date()
                })
                user.save();
            }
        }
    }

    await updateEvent.save();

    // notify followers if not author
    for (follower of updateEvent.following) {
        const user = await User.findById(follower._id);

        if (!updateEvent.author.equals(user)) {
            user.notifications.push({
                text: `<strong>${updateEvent.title}</strong> event has been changed! 
                <a class="text-decoration-none" href="/spots/${spot._id}">Go to event</a>`,
                status: 'new',
                timestamp: new Date()
            })
            user.save();
        }
    }

    req.flash('success', 'Event Updated!')
    res.redirect(`/spots/${spot._id}`);
}

module.exports.delete = async (req, res) => {
    const { eventId, spotId } = req.params;

    // remove event from it's associated spot and then delete
    await Spot.findByIdAndUpdate(spotId, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(eventId);

    req.flash('success', 'Event Deleted!')
    res.redirect(req.session.returnTo);
}

module.exports.follow = async (req, res) => {
    const user = req.user._id;
    const event = await Event.findById(req.params.eventId);

    if (!event.following.some(i => i.equals(user))) {
        // add user to events following list
        event.following.push(user);
        await event.save();

        // notify author of new follow if not author
        const author = await User.findById(event.author);
        const username = await User.findById(user);
        if (!author.equals(user)) {
            author.notifications.push({
                text: `<strong>${username.username}</strong> followed <strong>${event.title}</strong> event!`,
                status: 'new',
                timestamp: new Date()
            });
            await author.save()
        }

        res.send({ following: true, total: event.following.length });
    } else {
        // remove user from event following list
        event.following.pull(user);
        await event.save();

        res.send({ following: false, total: event.following.length });
    }
}
