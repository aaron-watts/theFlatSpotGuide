const Spot = require('../models/spot');
const Event = require('../models/event');
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

module.exports.create = async (req, res) => {
    const { spotId } = req.params
    const { event } = req.body;
    const spot = await Spot.findById(spotId);
    const newEvent = new Event ({
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day)),
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

module.exports.delete = async (req, res) => {
    const { eventId, spotId } = req.params;
    await Spot.findByIdAndUpdate(spotId, {$pull: { events: eventId }});
    await Event.findByIdAndDelete(eventId);
    req.flash('success', 'Event Deleted!')
    res.redirect(req.session.returnTo);
}

module.exports.follow = async (req, res) => {
    const user = req.user._id;
    const event = await Event.findById(req.params.eventId);
    if(!event.following.some(i => i.equals(user))) {
        event.following.push(user);
        await event.save();
        res.send({following: true, total: event.following.length});
    } else {
        event.following.pull(user);
        await event.save();
        res.send({following: false, total: event.following.length});
    }
}