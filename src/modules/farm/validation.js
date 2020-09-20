const Joi = require('@hapi/joi');

const farmSchema = Joi.object({
  images: Joi.array().items(Joi.string()).required(),
  firstName: Joi.string().required(),
  landForm: Joi.string().required(),
  landTenure: Joi.string().required(),
  irrigationType: Joi.string().required(),
  soilDepth: Joi.string().required(),
  accessibility: Joi.boolean().required(),
  landSize: Joi.string().required(),
  county: Joi.string().required(),
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
});

module.exports = farmSchema;
