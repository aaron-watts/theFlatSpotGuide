const express = require('express');
const router = express.Router();
const spots = require('../controllers/spots');

router.route('/')
    .get(spots.index)
    .post(spots.create)

router.get('/new', spots.newForm)

router.route('/:id')
    .get(spots.show)
    .put(spots.update)
    .delete(spots.delete)

router.get('/:id/edit', spots.editForm)




module.exports = router