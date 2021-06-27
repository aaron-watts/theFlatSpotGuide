const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');

const port = 3000;

mongoose.connect('mongodb://localhost:27017/spotGuide', {useNewUrlParser: true, useUnifiedTopology: true})
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

app.get('/', (req, res) => {
    res.send('Spot Guide!');
})

app.get('/spots', (req, res) => {
    res.render('index');
})

app.get('/spots/new', (req, res) => {
    res.render('new');
})

app.post('/spots', async (req, res) => {
    const spot = new Spot(req.body.spot)
    await spot.save();
    res.send(spot);
})

app.listen(port, () => {
    console.log('Listening...');
})