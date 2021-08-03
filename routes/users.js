const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users');
const { validateRegistration, validatePasswordChange, isLoggedIn } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user.registerForm)
    .post(validateRegistration, catchAsync(user.register))

router.route('/login')
    .get(user.loginForm)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        user.login)

router.get('/logout', isLoggedIn, user.logout)

router.route('/notifications')
    .patch(user.updateNotifications)
    .delete (user.deleteNotifications)

router.route('/account/location')
    .get(isLoggedIn, user.renderSetLocation)
    .put(isLoggedIn, catchAsync(user.setLocation))

router.get('/account', isLoggedIn, user.showSettings)

router.get('/password', isLoggedIn, user.renderPasswordForm)

router.patch('/password/:id', isLoggedIn, validatePasswordChange, catchAsync(user.changePassword))

router.get('/users/:username', user.getUsernames)

module.exports = router;