const mongoose = require('mongoose');
const User = require('../models/user')
const Course = require('../models/course')

main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/learning-management');
        await seedDB()
        console.log('MONGO CONNECTION OPEN!!')
    } catch (e) {
        console.log('OH NO MONGO CONNECTION ERROR!!')
        console.log(e)
    } finally {
        mongoose.connection.close();
    }

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"))
// db.once("open", () => {
//     console.log('Database Connected')
// })


// const CourseSchema = new Schema({
//     title: String,
//     price: Number,
//     instructor: String,
//     platform: [String],
//     description: String,
//     category: [String],
//     image: String
// })

const seedDB = async () => {
    await User.deleteMany({})


    const mycourses = [
        { title: 'Google Data Analytics', price: 15, instructor: 'Shaun Dave', platform: ['Coursera'], description: 'Gain an immersive understanding of the practices and processes used by a junior or associate data analyst in their day-to-day job', category: ['Data Science', 'IT', 'Analytics', 'Business Development'] },
        { title: 'Social Psychology', price: 10, instructor: 'Scott Plous', platform: ['EDX'], description: 'Ever wonder why people do what they do? This course—which includes more than $1,000 of video and reading materials—offers some answers based on the latest research from social psychology. ', category: ['Health', 'Psychology'] },
        { title: 'Principles of Photo Composition and Digital Image Post-Production', price: 30, instructor: 'Mark Valentine Sullivan', platform: ['Standford Online', 'OCW'], description: 'Create photographs you will be proud to share.. Build a solid foundation in digital photography, growing in knowledge from camera to composition!', category: ['Arts and Humanities', 'Nature', 'Wildlife'] },
        { title: 'Social Media Marketing', price: 20, instructor: 'Randy Hlavac', platform: ['Coursera'], description: 'Learn Digital marketing strategies and tactics', category: ['Marketing', 'Advertisement', 'Networking'] },
        { title: 'Building AI Agents and Agentic Workflows', price: 30, instructor: 'Tenzin Migmar', platform: ['MIT OCW', 'EDX'], description: 'Develop agentic AI applications that integrate tools, support reasoning, and improve performance through reflection', category: ['Artificial Intelligence'] },
        { title: 'ChalmersX: Model-Based Automotive Systems Engineering', price: 50, instructor: 'Jonas Fredriksson', platform: ['Edx'], description: 'Learn how to model and simulate system dynamics in automotive engineering', category: ['Engineering', 'Automotive Systems'] },
        { title: 'Machine Learning Operations with Google Cloud Platform', price: 40, instructor: 'Veronica Carlan', platform: ['Coursera', 'EDX'], description: 'Machine Learning Operations (MLOps) lies at the core of the AI Engineering function. In Statistics.com’s MLOps with GCP program you will learn to combine data engineering and data science skills to deploy machine learning models.', category: ['DevOps', 'Engineering', 'Science and Technology'] },
        { title: 'HarvardX: Energy and Thermodynamics', price: 60, instructor: 'John F Harmon', platform: ['Coursera'], description: 'Learn the fundamentals of chemistry and energy, from the types of energy to atomic mass and matter to enthalpy and thermodynamics.', category: ['Mechanical Engineering', 'Science and Technology'] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
    ]

    for (let course of mycourses){
        const name = course.instructor
        const email = course.instructor.split(' ')[0] + '@gmail.com'
        // console.log(course.title)
        const user = new User({username: name, email: email})
        const dummy_user = await User.register(user,'testing')
        const dummy_course = await Course.findOne({title: course.title})
        // console.log(dummy_course)
        dummy_course.author = dummy_user._id
        await dummy_course.save()
        // await dummy_course.populate('author')
        // console.log(dummy_course)
    }

    // const user1 = new User({ username: 'Shaun Dave', email: 'shaun@gmail.com' })
    // await User.register(user1, 'testing')

    // // course1 = 

    // const user2 = new User({ username: 'Scott Plous', email: 'scott@gmail.com' })
    // await User.register(user2, 'testing')

    // const user3 = new User({ username: 'Mark Valentine Sullivan', email: 'mark@gmail.com' })
    // await User.register(user3, 'testing')

    // const user4 = new User({ username: 'Randy Hlavac', email: 'randy@gmail.com' })
    // await User.register(user4, 'testing')

    // const user5 = new User({ username: 'Tenzin Migmar', email: 'tenzin@gmail.com' })
    // await User.register(user5, 'testing')

    // const user6 = new User({ username: 'Jonas Fredriksson', email: 'jonas@gmail.com' })
    // await User.register(user6, 'testing')

    // const user7 = new User({ username: 'Veronica Carlan', email: 'veronica@gmail.com' })
    // await User.register(user7, 'testing')

    // const user8 = new User({ username: 'John F Harmon', email: 'john@gmail.com' })
    // await User.register(user8, 'testing')

    await Course.updateMany(
        {},
        { $unset: { instructor: 1 } }
    );


}



// seedDB().then(() => {
//     mongoose.connection.close()
// }) 