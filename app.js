if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User = require('./models/user');
const userRoutes = require('./routes/users');
const spotRoutes = require('./routes/spots');
const eventsRoutes = require('./routes/events');

const MongoDBStore = require('connect-mongo');
const port = process.env.PORT || 3000;
// production
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/spotGuide';
// development
// const dbUrl = 'mongodb://localhost:27017/spotGuide';

const secret = process.env.SECRET;

mongoose.connect(dbUrl, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
 })
    .then(() => {
        console.log('Connected to Database..');
    })
    .catch(err => {
        console.log('Database Error!');
        console.log(err);
    })

const storeOptions = {
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
}

app.set('trust proxy', 1) // trust first proxy
const sessionConfig = {
    store: MongoDBStore.create(storeOptions),
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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvi6c44jt/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.use(express.static('public'));
// app.set('public', path.join(__dirname, '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', userRoutes)
app.use('/spots', spotRoutes);
app.use('/events', eventsRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.all('*', (req, res, next) => {
    // next(new ExpressError('Page Not Found', 404));
    res.status(404).render('404notfound');
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong!' } = err;

    // // 404 for bad IDs
    if(req.method === 'GET' && err.kind === 'ObjectId') {
        console.log(err)
        res.status(404).render('404notfound')
    }

    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log('Listening...');
})