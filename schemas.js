const Joi = require('joi')
const courseSchema = Joi.object({
    course: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      instructor: Joi.string().required(),
      platform: Joi.array().items(Joi.string()).default([]),
      description: Joi.string().required(),
      category: Joi.array().items(Joi.string()).required(),
      image: Joi.string().required(),
    }).required()
  }).required()

  module.exports = courseSchema;