const express = require('express')
const router = express.Router()

const Course = require('../models/course')
const ExpressError = require('../utils/ExpressError')
const {courseSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware')



const validateCourse = (req, res, next) => {
  // console.log(req.body)
  const result = courseSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}


router.get('/', async (req, res) => {
  const courses = await Course.find({})
  res.render('courses/index', { courses })
})

router.get('/new', isLoggedIn, (req, res) => {
  res.render('courses/new')
})

router.post('/',isLoggedIn, validateCourse, async (req, res, next) => {
  if (req.body.course.platform) {
    req.body.course.platform =
      req.body.course.platform.filter(p => p.trim() !== "")
  }
  if (req.body.course.category) {
    req.body.course.category =
      req.body.course.category.filter(p => p.trim() !== "")
  }
  const course = new Course(req.body.course)
  await course.save()
  req.flash('success','Successfully added a new course!')
  res.redirect(`/courses/${course._id}`)
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('reviews')
  // console.log(course)
  if (!course){
    req.flash('error', 'Cannot find that course!')
    return res.redirect('/courses')
  }
  res.render('courses/show', { course })
})

router.get('/:id/edit',isLoggedIn, async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course){
    req.flash('error', 'Cannot find that course!')
    return res.redirect('/courses')
  }
  res.render('courses/edit', { course })
})

router.put('/:id', isLoggedIn, validateCourse, async (req, res) => {
  // res.send('It worked!')
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body.course, { runValidators: true, new: true })
  req.flash('success','Successfully edited a course!')
  res.redirect(`/courses/${course._id}`)
})

router.delete('/:id',isLoggedIn, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses')
})


module.exports = router;