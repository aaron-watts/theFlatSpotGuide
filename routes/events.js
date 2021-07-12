const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');
const catchBrowser = require('../utils/catchBrowser');
const { rememberPage } = require('../utils/middleware');

const Spot = require('../models/spot');
const Event = require('../models/event');

router.get('/', rememberPage, events.index);

router.post('/:spotId', catchAsync(events.create));

router.patch('/:eventId', events.follow);

router.delete('/:eventId/:spotId', catchAsync(events.delete))

module.exports = router;