const mongoose = require('mongoose');
const Course = require('../models/course')

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
    await Course.deleteMany({})

    await Course.insertMany([
        { title: 'Google Data Analytics', price: 15, instructor: 'Shaun Dave', platform: ['Coursera'], description: 'Gain an immersive understanding of the practices and processes used by a junior or associate data analyst in their day-to-day job', category: ['Data Science', 'IT', 'Analytics', 'Business Development'] },
        { title: 'Social Psychology', price: 10, instructor: 'Scott Plous', platform: ['EDX'], description: 'Ever wonder why people do what they do? This course—which includes more than $1,000 of video and reading materials—offers some answers based on the latest research from social psychology. ', category: ['Health', 'Psychology'] },
        { title: 'Principles of Photo Composition and Digital Image Post-Production', price: 30, instructor: 'Mark Valentine Sullivan', platform: ['Standford Online', 'OCW'], description: 'Create photographs you will be proud to share.. Build a solid foundation in digital photography, growing in knowledge from camera to composition!', category: ['Arts and Humanities', 'Nature', 'Wildlife'] },
        { title: 'Social Media Marketing', price: 20, instructor: 'Randy Hlavac', platform: ['Coursera'], description: 'Learn Digital marketing strategies and tactics', category: ['Marketing', 'Advertisement', 'Networking'] },
        { title: 'Building AI Agents and Agentic Workflows', price: 30, instructor: 'Tenzin Migmar', platform: ['MIT OCW', 'EDX'], description: 'Develop agentic AI applications that integrate tools, support reasoning, and improve performance through reflection', category: ['Artificial Intelligence'] },
        { title: 'ChalmersX: Model-Based Automotive Systems Engineering', price: 50, instructor: 'Jonas Fredriksson', platform: ['Edx'], description: 'Learn how to model and simulate system dynamics in automotive engineering', category: ['Engineering', 'Automotive Systems'] },
        { title: 'Machine Learning Operations with Google Cloud Platform', price: 40, instructor: 'Veronica Carlan', platform: ['Coursera', 'EDX'], description: 'Machine Learning Operations (MLOps) lies at the core of the AI Engineering function. In Statistics.com’s MLOps with GCP program you will learn to combine data engineering and data science skills to deploy machine learning models.', category: ['DevOps', 'Engineering', 'Science and Technology'] },
        { title: 'HarvardX: Energy and Thermodynamics', price: 60, instructor: 'John F Harmon', platform: ['Coursera'], description: 'Learn the fundamentals of chemistry and energy, from the types of energy to atomic mass and matter to enthalpy and thermodynamics.', category: ['Mechanical Engineering', 'Science and Technology'] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
        // { title: '', price: , instructor: '', platform: [], description: '', category: [] },
    ])

    const courses = await Course.find({});

    // for (let course of courses) {

    //     await course.save();
    // }

    for (let course of courses) {
        course.images = [
            {
                url: 'https://res.cloudinary.com/dk1tlp170/image/upload/v1770049683/LMS/mlghjielq3lys1psg1pj.jpg',
                filename: 'LMS/mlghjielq3lys1psg1pj'            
            },
            {
                url: 'https://res.cloudinary.com/dk1tlp170/image/upload/v1770049683/LMS/dxctysfc21szfphdnkpt.jpg',
                filename: 'LMS/dxctysfc21szfphdnkpt',
            }
        ]
        await course.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
}) 