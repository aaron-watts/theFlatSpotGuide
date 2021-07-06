const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');

const Spot = require('../models/spot');
const Event = require('../models/event');

// router.get('/new', (req, res) => {
//     res.render('events/new');
// })

router.get('/', events.index);

router.post('/:spotId', catchAsync(events.create));

module.exports = router;