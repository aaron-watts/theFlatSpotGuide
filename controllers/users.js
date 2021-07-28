const { findByIdAndUpdate } = require('../models/user');
const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return res.send(err);
            req.flash('success', 'Welcome to SpotGuide')
            const redirectUrl = req.session.returnTo || '/spots';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        })
    } catch (err) {
        req.flash('error', 'err.message')
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/spots';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    const redirectUrl = req.session.returnTo || '/spots';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.updateNotifications = async (req, res) => {
    const user = await User.findById(req.user._id);

    try {
        for (notification of user.notifications) {
            if (notification.status === 'new') notification.status = 'seen';
        }
        await user.save();
    } catch (e) {
        res.send(false)
    }

    res.send(true);
}

module.exports.deleteNotifications = async (req, res) => {
    const user = await User.findById(req.user._id);

    try {
        for (let i = user.notifications.length; i > 0; i--) {
            user.notifications.pop();
        }
        
        await user.save();
    } catch (e) {
        res.send(false);
    }

    res.send(true)
}

module.exports.showSettings = (req, res) => {
    res.render('users/setting');
}

module.exports.renderSetLocation = (req, res) => {
    res.render('users/location');
}

module.exports.setLocation = async (req, res) => {
    const { location } = req.body;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()

    const user = await User.findById(req.user._id);

    user.location = location;
    user.geometry = geoData.body.features[0].geometry;

    await user.save();

    res.redirect('/account')
}