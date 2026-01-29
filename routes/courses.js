const express = require('express')
const router = express.Router()

const Course = require('../models/course')
// const ExpressError = require('../utils/ExpressError')
// const { courseSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor, validateCourse } = require('../middleware')

const courseControllers = require('../controllers/courses')


router.get('/', courseControllers.index)

router.get('/new', courseControllers.renderNewForm)

router.post('/', isLoggedIn, validateCourse, courseControllers.createCourse)

router.get('/:id', courseControllers.showCourse)

router.get('/:id/edit', isLoggedIn, isAuthor, courseControllers.renderEditForm)

router.put('/:id', isLoggedIn, isAuthor, validateCourse, courseControllers.updateCourse)

router.delete('/:id', isLoggedIn, isAuthor, courseControllers.deleteCourse)


module.exports = router;