const express = require('express')
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const Course = require('../models/course')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js')

const reviewControllers = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, reviewControllers.createReview)

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, reviewControllers.deleteReview)


module.exports = router;