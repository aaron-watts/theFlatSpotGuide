const Spot = require('../models/spot');
const Event = require('../models/event');
const { monthArray } = require('../utils');

module.exports.index = async (req, res) => {
    const events = await Event.find({ 'date': {'$gte': new Date()} })
        .sort({'date': 1})
        .populate('spot');
    res.render('events/index', { events, monthArray });
}

module.exports.create = async (req, res) => {
    const { spotId } = req.params
    const { event } = req.body;
    const spot = await Spot.findById(spotId);
    const newEvent = new Event ({
        author: 'user99',
        date: new Date(parseInt(event.year), parseInt(event.month) - 1, parseInt(event.day)),
        spot: spotId
    })
    spot.events.push(newEvent);
    await newEvent.save();
    await spot.save();
    res.redirect(`/spots/${spotId}`);
}