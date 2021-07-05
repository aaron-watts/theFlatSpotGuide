const express = require('express');
const router = express.Router();
const events = require('../controllers/events');

const Spot = require('../models/spot');
const Event = require('../models/event');

// router.get('/new', (req, res) => {
//     res.render('events/new');
// })

router.post('/:spotId', events.create)

module.exports = router;