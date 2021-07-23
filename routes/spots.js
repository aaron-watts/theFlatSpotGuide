const express = require('express');
const router = express.Router();
const spots = require('../controllers/spots');
const catchAsync = require('../utils/catchAsync');
const { rememberPage, validateSpot } = require('../utils/middleware');

router.route('/')
    .get(rememberPage, spots.index)
    .post(validateSpot, catchAsync(spots.create))

router.get('/new', spots.newForm)

router.route('/:id')
    .get(rememberPage, catchAsync(spots.show))
    .put(catchAsync(spots.update))
    .delete(catchAsync(spots.delete))
    .patch(spots.follow)

router.get('/:id/edit', spots.editForm)

module.exports = router