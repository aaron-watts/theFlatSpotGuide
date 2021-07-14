const Spot = require('../models/spot');
const Event = require('../models/event');
const User = require('../models/user');
const { monthArray } = require('../utils/data');
const { findByIdAndRemove, findByIdAndUpdate } = require('../models/spot');

module.exports.index = async (req, res) => {
    const events = await Event.find({ 'date': {'$gte': new Date()} })
        .sort({'date': 1})
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
    const spot = await Spot.findById(spotId);

    const newEvent = new Event ({
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
            parseInt(event.hours), parseInt(event.minutes)),
        title: event.title,
        description: event.description,
        spot: spotId
    })
    newEvent.author = req.user._id;
    newEvent.following.push(req.user._id);
    spot.events.push(newEvent);
    await newEvent.save();
    await spot.save();

    req.flash('success', 'Event Added!')
    res.redirect(`/spots/${spotId}`);
}

module.exports.create = async (req, res) => {
    const { event } = req.body;
    const spot = await Spot.findOne({name: event.spot});

    const newEvent = new Event({
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
            parseInt(event.hours), parseInt(event.minutes)),
        title: event.title,
        description: event.description,
        spot
    })
    newEvent.author = req.user._id;
    newEvent.following.push(req.user._id);
    spot.events.push(newEvent);
    await newEvent.save();
    await spot.save();

    req.flash('success', 'Event Added!')
    res.redirect(`/events`);
}

module.exports.update = async (req, res) => {
    const { eventId, spotId } = req.params;
    const { event } = req.body
    const updateEvent = await Event.findById(eventId)
        .populate('spot');
    const spot = await Spot.findOne({name: event.spot});

    const newDetails = {
        title: event.title,
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day),
            parseInt(event.hours), parseInt(event.minutes)),
        description: event.description,
        spot
    }
    const edited = await Event.findByIdAndUpdate(eventId, { ...newDetails });
    const newEvent = await edited.save();

    // if spot has changed update spot documents' event refs
    if (!spot.equals(spotId)) {
        await Spot.findByIdAndUpdate(spotId, {$pull: {events: eventId}});
        await spot.events.push(newEvent);
        await spot.save()
    }
    
    req.flash('success', 'Event Updated!')
    res.redirect(`/spots/${spot._id}`);
}

module.exports.delete = async (req, res) => {
    const { eventId, spotId } = req.params;

    // remove event from it's associated spot and then delete
    await Spot.findByIdAndUpdate(spotId, {$pull: { events: eventId }});    
    await Event.findByIdAndDelete(eventId);

    req.flash('success', 'Event Deleted!')
    res.redirect(req.session.returnTo);
}

module.exports.follow = async (req, res) => {
    const user = req.user._id;
    const event = await Event.findById(req.params.eventId);

    if(!event.following.some(i => i.equals(user))) {
        // add user to events following list
        event.following.push(user);
        await event.save();

        // notify author of new follow if not author
        const author = await User.findById(event.author);
        const username = await User.findById(user);
        if (!author.equals(user)) {
            author.notifications.push({
                text: `${username.username} followed ${event.title} event!`,
                status: 'new'
            });
            await author.save()
        }

        res.send({following: true, total: event.following.length});
    } else {
        // remove user from event following list
        event.following.pull(user);
        await event.save();

        res.send({following: false, total: event.following.length});
    }
}
