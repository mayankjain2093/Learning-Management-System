const Course = require('../models/course')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
  const course = await Course.findById(req.params.id)
  const review = new Review(req.body.review)
  review.author = req.user._id
  course.reviews.push(review)
  await review.save()
  await course.save()
  req.flash('success', 'Successfully added a review!')
  res.redirect(`/courses/${course._id}`)
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId)
  await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  req.flash('success', 'Successfully deleted a review!')
  res.redirect(`/courses/${id}`)
}