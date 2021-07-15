const { findByIdAndUpdate } = require('../models/user');
const User = require('../models/user');

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
    console.log(req.body)
    req.flash('success', 'Welcome back!');
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
        for (let i = 0; i < user.notifications.length; i++) {
            user.notifications.pop(notification);
        }
        
        await user.save();
    } catch (e) {
        res.send(false);
    }

    res.send(true)
}