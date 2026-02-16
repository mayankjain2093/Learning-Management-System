const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

// https://res.cloudinary.com/dk1tlp170/image/upload/v1770055977/YelpCamp/sghxim6g1220agks1ydt.jpg

// https://res.cloudinary.com/dk1tlp170/image/upload/w_100/v1770055977/YelpCamp/sghxim6g1220agks1ydt.jpg

const ImageSchema = new Schema({
            url: String,
            filename: String,
        })

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const CourseSchema = new Schema({
    title: String,
    price: Number,
    // instructor: String,
    platform: [String], 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    category: [String],
    images: [ImageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CourseSchema.post('findOneAndDelete', async function(doc) {
    // console.log('delete')
    if (doc){
        await Review.deleteMany({_id: {$in: doc.reviews }})
    }
})

module.exports = mongoose.model('Course', CourseSchema)