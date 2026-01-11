const mongoose = require('mongoose')
const Review = require('./review')
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

CourseSchema.post('findOneAndDelete', async function(doc) {
    // console.log('delete')
    if (doc){
        await Review.deleteMany({_id: {$in: doc.reviews }})
    }
})

module.exports = mongoose.model('Course', CourseSchema)