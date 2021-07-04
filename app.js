const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const spotRoutes = require('./routes/spots');

const port = 3000;

mongoose.connect('mongodb://localhost:27017/spotGuide', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database..');
    })
    .catch(err => {
        console.log('Database Error!');
        console.log(err);
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/spots', spotRoutes);

app.get('/', (req, res) => {
    res.send('Spot Guide!');
})

app.listen(port, () => {
    console.log('Listening...');
})