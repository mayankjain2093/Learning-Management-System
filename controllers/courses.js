const Course = require('../models/course')
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
  const courses = await Course.find({}).populate('author')
  res.render('courses/index', { courses })
}

module.exports.renderNewForm = (req, res) => {
  res.render('courses/new')
}

module.exports.createCourse = async (req, res, next) => {
  if (req.body.course.platform) {
    req.body.course.platform =
      req.body.course.platform.filter(p => p.trim() !== "")
  }
  if (req.body.course.category) {
    req.body.course.category =
      req.body.course.category.filter(p => p.trim() !== "")
  }
  const course = new Course(req.body.course)
  course.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  course.author = req.user._id
  await course.save()
  console.log(course)
  req.flash('success', 'Successfully added a new course!')
  res.redirect(`/courses/${course._id}`)
}

module.exports.showCourse = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) {
    req.flash('error', 'Cannot find that course!')
    return res.redirect('/courses')
  }
  res.render('courses/edit', { course })
}

module.exports.updateCourse =  async (req, res) => {
  // res.send('It worked!')
  const { id } = req.params;
  // console.log(req.body)
  if (req.body.course.platform) {
    req.body.course.platform =
      req.body.course.platform.filter(p => p.trim() !== "")
  }
  if (req.body.course.category) {
    req.body.course.category =
      req.body.course.category.filter(p => p.trim() !== "")
  }
  const cour = await Course.findByIdAndUpdate(id, req.body.course, { runValidators: true, new: true })
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
  cour.images.push(...imgs)
  await cour.save()
  if(req.body.deleteImages){
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await cour.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
  }
  req.flash('success', 'Successfully edited a course!')
  res.redirect(`/courses/${cour._id}`)
}

module.exports.deleteCourse =  async (req, res) => {
  // Below function triggesr findOneAndDelete hook, defined in the CourseSchema defined in models/course file. This trigger
  // automatically deletes all the reviews associated with that course
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses')
}