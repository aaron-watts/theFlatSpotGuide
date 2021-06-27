const Spot = require('../models/spot');

module.exports.index = async (req, res) => {
    const spots = await Spot.find({});
    res.render('index', { spots });
}

module.exports.newForm = (req, res) => {
    res.render('new');
}

module.exports.show = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('show', { spot });
}

module.exports.editForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('edit', { spot });
}

module.exports.create = async (req, res) => {
    const spot = new Spot(req.body.spot)
    await spot.save();
    res.redirect('/spots');
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, {...req.body.spot});
    res.redirect(`/spots/${id}`);
}

module.exports.delete = async (req, res) => {
    const spot = await Spot.findByIdAndDelete(req.params.id);
    res.redirect('/spots');
}
