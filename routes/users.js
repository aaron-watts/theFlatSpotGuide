const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users')
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user.registerForm)
    .post(catchAsync(user.register))

router.route('/login')
    .get(user.loginForm)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        user.login)

router.get('/logout', user.logout)

router.route('/notifications')
    .patch(user.updateNotifications)
    .delete (user.deleteNotifications)

router.route('/account/location')
    .get(user.renderSetLocation)
    .put(catchAsync(user.setLocation))

router.route('/account')
    .get(user.showSettings)

module.exports = router;