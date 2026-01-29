const {courseSchema, reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Course = require('./models/course')
const Review = require('./models/review')


// This module checks if a user is authenticated , if it is not, then it stores a returnTo variable in sessions. Then it flashes
//  an error messages and redirects user to a login page
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next()
}

// Before logging a user, this middleware checks if session has storeReturnTo. If it has, it stores this information to a 
// locals variable. This allows us to persist information in a session even if passport.authenticate destroys any session 
// information
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCourse = (req, res, next) => {
  // console.log(req.body)
  const result = courseSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course.author.equals(req.user._id)) {
    req.flash('error', "You do not have permission to edit the course")
    return res.redirect(`/courses/${req.params.id}`)
  }
  next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You do not have permission to edit the review")
    return res.redirect(`/courses/${id}`)
  }
  next()
}


