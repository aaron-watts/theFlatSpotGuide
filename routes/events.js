const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');
const catchBrowser = require('../utils/catchBrowser');
const { rememberPage, validateEvent } = require('../utils/middleware');

const Spot = require('../models/spot');
const Event = require('../models/event');

router.get('/', rememberPage, events.index);

router.route('/new')
    .get(catchAsync(events.newForm))
    .post(validateEvent, catchAsync(events.create));

router.post('/:spotId', validateEvent, catchAsync(events.addToSpot));

router.patch('/:eventId', events.follow);

router.get('/:eventId/edit', catchAsync(events.editForm));

router.route('/:eventId/:spotId')
    .put(validateEvent, catchAsync(events.update))
    .delete(catchAsync(events.delete));

module.exports = router;