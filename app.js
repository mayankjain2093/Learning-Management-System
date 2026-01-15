const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Course = require('./models/course')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi');
const {courseSchema,reviewSchema} = require('./schemas.js')
const courseRoutes = require('./routes/courses')
const reviewRoutes = require('./routes/reviews')

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





app.get('/', (req, res) => {
  // res.send('HELLO FROM LEARNING MANAGEMENT SYSTEM')
  res.render('home')
})

app.use('/courses', courseRoutes)

// app.get('/makecourse',async (req,res) => {
//     const courseTest = new Course({title: 'Machine Learning', price: 250, instructor: 'Andrew NG',
//          platform: ['Coursera', 'Standford Online'], description: 'This course teaches fundamental of Machine Learning', category: ['Science and Technology', 'Mathematics']})
//     await courseTest.save()
//     res.send(courseTest)
// })

app.use('/courses/:id/reviews', reviewRoutes)


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