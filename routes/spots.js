const express = require('express');
const router = express.Router();
const spots = require('../controllers/spots');
const catchAsync = require('../utils/catchAsync');
const { rememberPage } = require('../utils/middleware');

router.route('/')
    .get(rememberPage, spots.index)
    .post(catchAsync(spots.create))

router.get('/new', spots.newForm)

router.route('/:id')
    .get(rememberPage, spots.show)
    .put(catchAsync(spots.update))
    .delete(catchAsync(spots.delete))

router.get('/:id/edit', spots.editForm)




module.exports = router