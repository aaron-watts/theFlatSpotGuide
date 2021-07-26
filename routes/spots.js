const express = require('express');
const router = express.Router();
const spots = require('../controllers/spots');
const catchAsync = require('../utils/catchAsync');
const { rememberPage, validateSpot, isLoggedIn, resizeImage } = require('../utils/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const spot = require('../models/spot');
const upload = multer({ storage });

router.route('/')
    .get(rememberPage, spots.index)
    .post(
        isLoggedIn, 
        upload.array('image', 2), 
        validateSpot, 
        catchAsync(spots.create)
    )
    
router.get('/new', isLoggedIn, spots.newForm)

router.route('/:id')
    .get(rememberPage, catchAsync(spots.show))
    .put(
        isLoggedIn, 
        upload.array('image', 2), 
        validateSpot, 
        catchAsync(spots.update)
    )
    .delete(catchAsync(spots.delete))
    .patch(spots.follow)

router.get('/:id/edit', isLoggedIn, spots.editForm)

module.exports = router