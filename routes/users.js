const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users')

router.get('/register', user.registerForm)

router.post('/register', user.register)

module.exports = router;