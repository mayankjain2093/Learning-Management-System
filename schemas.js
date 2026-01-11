const Joi = require('joi')

const courseSchema = Joi.object({
    course: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      instructor: Joi.string().required(),
      platform: Joi.array().items(Joi.string().allow('')).default([]),
      description: Joi.string().required(),
      category: Joi.array().items(Joi.string().allow('')).default([]),
      image: Joi.string().required(),
    }).required()
  }).required()

  const reviewSchema = Joi.object({
    review: Joi.object({
      body: Joi.string().required(),
      rating: Joi.number().required().min(1).max(5)
    }).required()
  }).required()


  module.exports = {courseSchema,reviewSchema};