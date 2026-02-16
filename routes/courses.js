const express = require('express')
const router = express.Router()
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

const Course = require('../models/course')
// const ExpressError = require('../utils/ExpressError')
// const { courseSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor, validateCourse } = require('../middleware')

const courseControllers = require('../controllers/courses')


router.get('/', courseControllers.index)

router.get('/new', courseControllers.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCourse, courseControllers.createCourse)
// router.post('/',upload.array('image'), (req,res) => {
//     console.log(req.body, req.files)
//     res.send('It worked!')
// })

router.get('/:id', courseControllers.showCourse)

router.get('/:id/edit', isLoggedIn, isAuthor, courseControllers.renderEditForm)

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCourse, courseControllers.updateCourse)

router.delete('/:id', isLoggedIn, isAuthor, courseControllers.deleteCourse)


module.exports = router;