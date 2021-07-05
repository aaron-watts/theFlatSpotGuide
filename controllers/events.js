const Spot = require('../models/spot');
const Event = require('../models/event');

module.exports.create = async (req, res) => {
    const { spotId } = req.params
    const { event } = req.body;
    const spot = await Spot.findById(spotId);
    const newEvent = new Event ({
        author: 'user99',
        date: new Date(parseInt(event.year), parseInt(event.month), parseInt(event.day)),
        spot: spotId
    })
    spot.events.push(newEvent);
    await newEvent.save();
    await spot.save();
    res.redirect(`/spots/${spotId}`);
}