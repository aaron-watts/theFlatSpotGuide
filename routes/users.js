const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users')
const catchAsync = require('../utils/catchAsync');

router.get('/register', user.registerForm)

router.post('/register', catchAsync(user.register))

router.get('/login', user.loginForm)

router.post('/login', passport.authenticate('local', 
{ failureFlash: true, failureRedirect: '/login' }),
user.login)

router.get('/logout', user.logout)

router.patch('/notifications', user.notifications)

module.exports = router;