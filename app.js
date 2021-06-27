const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Spot = require('./models/spot');

const port = 3000;

mongoose.connect('mongodb://localhost:27017/spotGuide', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database..');
    })
    .catch(err => {
        console.log('Database Error!');
        console.log(err);
    })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('Spot Guide!');
})

app.get('/spots', async (req, res) => {
    const spots = await Spot.find({});
    res.render('index', { spots });
})

app.get('/spots/new', (req, res) => {
    res.render('new');
})

app.get('/spots/:id', async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('show', { spot });
})

app.get('/spots/:id/edit', async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('edit', { spot });
})

app.post('/spots', async (req, res) => {
    const spot = new Spot(req.body.spot)
    await spot.save();
    res.redirect('/spots');
})

app.put('/spots/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, {...req.body.spot});
    res.redirect(`/spots/${id}`);
})

app.delete('/spots/:id', async (req, res) => {
    const spot = await Spot.findByIdAndDelete(req.params.id);
    res.redirect('/spots');
})

app.listen(port, () => {
    console.log('Listening...');
})