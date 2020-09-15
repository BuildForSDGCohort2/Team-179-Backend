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
  roles: Joi.array().items(Joi.string()),
});
const postRolechema = Joi.object({
  role: Joi.string()
    .min(3)
    .max(30)
    .required(),
  description: Joi.string()
    .min(3)
    .max(500),
});
module.exports = { postUserSchema, postRolechema };
