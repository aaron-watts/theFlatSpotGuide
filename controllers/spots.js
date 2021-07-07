const Spot = require('../models/spot');
const Event = require('../models/event');
const { monthArray } = require('../utils');

module.exports.index = async (req, res) => {
    const spots = await Spot.find({})
        .populate({
            path: 'events',
            match: { date: { $gt: new Date() } },
            options: {
                sort: { date: 1 }
            }
        });
    res.render('spots/index', { spots });
}

module.exports.newForm = (req, res) => {
    res.render('spots/new');
}

module.exports.show = async (req, res) => {
    const spot = await Spot.findById(req.params.id)
        .populate({
            path: 'events',
            match: { date: { $gt: new Date() } },
            options: {
                sort: { date: 1 }
            }
        });
    res.render('spots/show', { spot, monthArray });
}

module.exports.editForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', { spot });
}

module.exports.create = async (req, res) => {
    const spot = new Spot(req.body.spot)
    spot.author = 'aaron99'
    await spot.save();
    req.flash('success', 'New Spot Created!')
    res.redirect('/spots');
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    res.redirect(`/spots/${id}`);
}

module.exports.delete = async (req, res) => {
    const spot = await Spot.findByIdAndDelete(req.params.id);
    res.redirect('/spots');
}
