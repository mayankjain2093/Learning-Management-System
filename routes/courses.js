const express = require('express')
const router = express.Router()

const Course = require('../models/course')
// const ExpressError = require('../utils/ExpressError')
// const { courseSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor, validateCourse } = require('../middleware')



router.get('/', async (req, res) => {
  const courses = await Course.find({}).populate('author')
  res.render('courses/index', { courses })
})

router.get('/new', isLoggedIn, (req, res) => {
  res.render('courses/new')
})

router.post('/', isLoggedIn, validateCourse, async (req, res, next) => {
  if (req.body.course.platform) {
    req.body.course.platform =
      req.body.course.platform.filter(p => p.trim() !== "")
  }
  if (req.body.course.category) {
    req.body.course.category =
      req.body.course.category.filter(p => p.trim() !== "")
  }
  const course = new Course(req.body.course)
  course.author = req.user._id
  await course.save()
  req.flash('success', 'Successfully added a new course!')
  res.redirect(`/courses/${course._id}`)
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path: 'author'
    }
    }).populate('author')
  // console.log(course)
  if (!course) {
    req.flash('error', 'Cannot find that course!')
    return res.redirect('/courses')
  }
  res.render('courses/show', { course })
})

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) {
    req.flash('error', 'Cannot find that course!')
    return res.redirect('/courses')
  }
  res.render('courses/edit', { course })
})

router.put('/:id', isLoggedIn, isAuthor, validateCourse, async (req, res) => {
  // res.send('It worked!')
  const { id } = req.params;
  if (req.body.course.platform) {
    req.body.course.platform =
      req.body.course.platform.filter(p => p.trim() !== "")
  }
  if (req.body.course.category) {
    req.body.course.category =
      req.body.course.category.filter(p => p.trim() !== "")
  }
  const cour = await Course.findByIdAndUpdate(id, req.body.course, { runValidators: true, new: true })
  req.flash('success', 'Successfully edited a course!')
  res.redirect(`/courses/${cour._id}`)
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
  // Below function triggesr findOneAndDelete hook, defined in the CourseSchema defined in models/course file. This trigger
  // automatically deletes all the reviews associated with that course
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses')
})


module.exports = router;