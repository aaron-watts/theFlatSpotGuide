const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');
const catchBrowser = require('../utils/catchBrowser');
const { rememberPage, validateEvent, validatePinnedEvent, isLoggedIn } = require('../utils/middleware');

const Spot = require('../models/spot');
const Event = require('../models/event');

router.get('/', rememberPage, events.index);

router.route('/new')
    .get(catchAsync(events.newForm))
    .post(isLoggedIn, validateEvent, catchAsync(events.create));

router.post('/:spotId', isLoggedIn, validatePinnedEvent, catchAsync(events.addToSpot));

router.patch('/:eventId', events.follow);

router.get('/:eventId/edit', isLoggedIn, catchAsync(events.editForm));

router.route('/:eventId/:spotId')
    .put(isLoggedIn, validateEvent, catchAsync(events.update))
    .delete(isLoggedIn, catchAsync(events.delete));

module.exports = router;