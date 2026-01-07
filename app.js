const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Course = require('./models/course')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi');
const {courseSchema,reviewSchema} = require('./schemas.js')

const Review = require('./models/review')


main().catch(err => console.log(err));
async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/learning-management');
    console.log('MONGO CONNECTION OPEN!!')
  } catch (e) {
    console.log('OH NO MONGO CONNECTION ERROR!!')
    console.log(e)
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log('Database Connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateCourse = (req, res, next) => {
  const result = courseSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

app.get('/', (req, res) => {
  // res.send('HELLO FROM LEARNING MANAGEMENT SYSTEM')
  res.render('home')
})

// app.get('/makecourse',async (req,res) => {
//     const courseTest = new Course({title: 'Machine Learning', price: 250, instructor: 'Andrew NG',
//          platform: ['Coursera', 'Standford Online'], description: 'This course teaches fundamental of Machine Learning', category: ['Science and Technology', 'Mathematics']})
//     await courseTest.save()
//     res.send(courseTest)
// })

app.get('/courses', async (req, res) => {
  const courses = await Course.find({})
  res.render('courses/index', { courses })
})

app.get('/courses/new', (req, res) => {
  res.render('courses/new')
})

app.post('/courses', validateCourse, async (req, res, next) => {
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

app.get('/courses/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('courses/show', { course })
})

app.get('/courses/:id/edit', async (req, res) => {
  const course = await Course.findById(req.params.id)
  res.render('courses/edit', { course })
})

app.put('/courses/:id', validateCourse, async (req, res) => {
  // res.send('It worked!')
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body.course, { runValidators: true, new: true })
  res.redirect(`/courses/${course._id}`)
})

app.delete('/courses/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses')
})

app.post('/courses/:id/reviews', validateReview, async(req,res) => {
  const course = await Course.findById(req.params.id)
  const review = new Review(req.body.review)
  course.reviews.push(review)
  await review.save()
  await course.save()
  res.redirect(`/courses/${course._id}`)
})

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  // const {message= 'Something went wrong', status = 500} = err;
  if (!err.message) err.message = 'Something went wrong'
  if (!err.status) err.status = 500
  res.status(err.status).render('error', { err })
})

app.listen(3000, () => {
  console.log('APP SERVING ON PORT 3000')
})