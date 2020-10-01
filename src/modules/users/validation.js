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
const updateProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  roles: Joi.array().items(Joi.string()),
  image: Joi.string(),
  bios: Joi.string(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  idNumber: Joi.string().required(),
  kraPin: Joi.string().required(),
  certificateOfConduct: Joi.string(),
});
const createProfileSchema = Joi.object({
  image: Joi.string(),
  bios: Joi.string(),
  phoneNumber: Joi.string().min(3).max(15).required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  idNumber: Joi.string().min(3).max(15).required(),
  kraPin: Joi.string().min(3).required(),
  certificateOfConduct: Joi.string().required(),
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
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(35)
    .required(),
});
const passwordResetSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(35)
    .required(),
  confirmPassword: Joi.ref('password'),
  code: Joi.string().required(),
});
const forgotSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  confirmEmail: Joi.ref('email'),
});
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(35)
    .required(),
  password: Joi.string()
    .min(8)
    .max(35)
    .required(),
  confirmPassword: Joi.ref('password'),
});
module.exports = {
  postUserSchema,
  postRolechema,
  loginSchema,
  passwordResetSchema,
  forgotSchema,
  updateProfileSchema,
  createProfileSchema,
  changePasswordSchema,
};
