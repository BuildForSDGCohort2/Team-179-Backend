const Joi = require('@hapi/joi');

const farmSchema = Joi.object({
  images: Joi.string(),
  landForm: Joi.string().required(),
  landTenure: Joi.string().required(),
  irrigationType: Joi.string().required(),
  soilDepth: Joi.string().required(),
  soilType: Joi.string().required(),
  accessibility: Joi.boolean().required(),
  landSize: Joi.string().required(),
  county: Joi.string().required(),
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
});

module.exports = farmSchema;
