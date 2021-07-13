const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');
const catchBrowser = require('../utils/catchBrowser');
const { rememberPage } = require('../utils/middleware');

const Spot = require('../models/spot');
const Event = require('../models/event');

router.get('/', rememberPage, events.index);

router.get('/new', catchAsync(events.newForm))

router.post('/new', catchAsync(events.create))

router.post('/:spotId', catchAsync(events.addToSpot));

router.patch('/:eventId', events.follow);

router.get('/:eventId/edit', catchAsync(events.editForm))

router.put('/:eventId/:spotId', catchAsync(events.update))

router.delete('/:eventId/:spotId', catchAsync(events.delete))

module.exports = router;