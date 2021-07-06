if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const User = require('./models/user');
const spotRoutes = require('./routes/spots');
const eventsRoutes = require('./routes/events')

const port = 3000;

mongoose.connect('mongodb://localhost:27017/spotGuide', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database..');
    })
    .catch(err => {
        console.log('Database Error!');
        console.log(err);
    })

const sessionConfig = {
    //store: MongoDBStore.create(storeOptions),
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/spots', spotRoutes);
app.use('/events', eventsRoutes);

app.get('/', (req, res) => {
    res.send('Spot Guide!');
})

app.get('/viewcount', (req, res) => {
    if (req.session.count) req.session.count++;
    else req.session.count = 1;
    res.send(`You have viewed this page ${req.session.count} times.`)
})

app.get('/register', (req, res) => {
    const { username = 'Guest' } = req.query;
    req.session.username = username;
    res.redirect('/greet');
})

app.get('/greet', (req, res) => {
    const { username } = req.session;
    res.send(`Welcome back, ${username}`);
})

app.listen(port, () => {
    //console.log(process.env.SECRET)
    console.log('Listening...');
})