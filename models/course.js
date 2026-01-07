const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    title: String,
    price: Number,
    instructor: String,
    platform: [String], 
    description: String,
    category: [String],
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

module.exports = mongoose.model('Course', CourseSchema)