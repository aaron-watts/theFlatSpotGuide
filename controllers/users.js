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
            res.redirect('/spots');
        })
    } catch (err) {
        req.flash('error', 'err.message')
        res.redirect('redirect');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    res.send(req.body)
}