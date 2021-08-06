const { findByIdAndUpdate } = require('../models/user');
const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const mailer = require('../utils/sendMail');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password} = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        // send welcome email
        const subject = `Thanks for joining the FlatspotGuide, ${username}!`;
        const text = `Welcome to the FlatspotGuide! Don't forget to set your location in account settings, so we know what spots to show you first!`;
        const html = `Welcome to the FlatspotGuide! Don't forget to set your location in account settings, so we know what spots to show you first!`;
        try {
            mailer.send(email, subject, text, html);
        } catch (err) {
            console.log(`Something went wrong while emailing ${email}`);
        }

        req.login(registeredUser, err => {
            if (err) return res.send(err);
            req.flash('success', 'Welcome to SpotGuide! Be sure to set your location in the account settings!')
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

module.exports.renderEmailForm = (req, res) => {
    res.render('users/email');
}

module.exports.updateEmail = async (req, res) => {
    const { email } = req.body.user;
    const user = await User.findByIdAndUpdate(req.user._id, {email});

    res.redirect('/account');
}

module.exports.renderPasswordForm = (req, res) => {
    res.render('users/password');
}

module.exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body.user;

    if (newPassword === confirmPassword) {
        const user = await User.findById(id)
        try {
            await user.changePassword(oldPassword, newPassword);
            req.flash('success', 'Password successfully changed!')
            res.redirect('/account');
        } catch (err) {
            req.flash('error', 'Password is wrong! Consider logging out and requesting a reset!');
            res.redirect('/password');
        }
        
    } else {
        res.flash('error', 'Passwords do not match');
        res.redirect('/password');
    }
    
}

module.exports.getUsernames = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({'username': username});
    if (user === null) res.send({exists: false});
    else res.send({exists: true});
}