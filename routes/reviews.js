const express = require('express')
const router = express.Router({ mergeParams: true })

const Course = require('../models/course')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, async(req,res) => {
  const course = await Course.findById(req.params.id)
  const review = new Review(req.body.review)
  course.reviews.push(review)
  await review.save()
  await course.save()
  req.flash('success','Successfully added a review!')
  res.redirect(`/courses/${course._id}`)
})

router.delete('/:reviewId', async(req,res) => { 
  const {id, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId)
  await Course.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
  req.flash('success','Successfully deleted a review!')
  res.redirect(`/courses/${id}`)
})


module.exports = router;