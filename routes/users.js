const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users');
const { validateRegistration, isLoggedIn } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user.registerForm)
    .post(validateRegistration, catchAsync(user.register))

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

router.get('/account', user.showSettings)

router.get('/password', isLoggedIn, user.renderPasswordForm)

router.patch('/password/:id', isLoggedIn, catchAsync(user.changePassword))

router.get('/users/:username', user.getUsernames)

module.exports = router;