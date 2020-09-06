const Joi = require('@hapi/joi');

const postUserSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(35)
    .required(),
  confirmPassword: Joi.ref('password'),
});
module.exports = { postUserSchema };
