const Joi = require('@hapi/joi');

const regEx = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
const mpesaValidationSchema = Joi.object({
  phone: Joi.string()
    .pattern(regEx)
    .min(3)
    .max(15)
    .required(),
  amount: Joi.number().required(),
});

module.exports = mpesaValidationSchema;
