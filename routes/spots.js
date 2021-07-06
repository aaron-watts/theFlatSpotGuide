const express = require('express');
const router = express.Router();
const spots = require('../controllers/spots');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(spots.index)
    .post(catchAsync(spots.create))

router.get('/new', spots.newForm)

router.route('/:id')
    .get(spots.show)
    .put(catchAsync(spots.update))
    .delete(catchAsync(spots.delete))

router.get('/:id/edit', spots.editForm)




module.exports = router