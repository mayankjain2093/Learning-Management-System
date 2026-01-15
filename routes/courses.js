const express = require('express')
const router = express.Router()

const Course = require('../models/course')
const ExpressError = require('../utils/ExpressError')
const {courseSchema} = require('../schemas.js')



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

router.get('/new', (req, res) => {
  res.render('courses/new')
})

router.post('/', validateCourse, async (req, res, next) => {
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
  res.redirect(`/courses/${course._id}`)
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('reviews')
  // console.log(course)
  res.render('courses/show', { course })
})

router.get('/:id/edit', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('courses/edit', { course })
})

router.put('/:id', validateCourse, async (req, res) => {
  // res.send('It worked!')
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body.course, { runValidators: true, new: true })
  res.redirect(`/courses/${course._id}`)
})

router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses')
})


module.exports = router;