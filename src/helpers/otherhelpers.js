const crypto = require('crypto');
const PhoneNumber = require('awesome-phonenumber');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../appconfigs/config')();

const otherHelper = {};

otherHelper.generateRandomHexString = (len) => crypto
  .randomBytes(Math.ceil(len / 2))
  .toString('hex') // convert to hexadecimal format
  .slice(0, len)
  .toUpperCase(); // return required number of characters

otherHelper.generateRandomNumberString = () => Math.floor(Math.random() * 8999 + 1000);

/**
 * Uploads files from the frontend to the destination directory.
 *
 * @param phone - The phone number that requires validation.
 * @param RegionalCode - The regional code of the phone number that requires validation.
 */
otherHelper.parsePhoneNo = (phone, RegionCode) => {
  try {
    const pn = new PhoneNumber(phone, RegionCode);
    if (!pn.isValid()) {
      return {
        status: false,
        data: 'Provided no is invalid mobile no.',
      };
    } if (!pn.isMobile()) {
      return {
        status: false,
        data: 'Provided no should be mobile no.',
      };
    } if (pn.isValid()) {
      return {
        status: true,
        data: pn.getNumber('e164'),
      };
    }
    return {
      status: true,
      data: pn.getNumber('e164'),
    };
  } catch (err) {
    return err;
  }
};

// To ensure consistent send response
otherHelper.sendResponse = (res, status, success, data, errors, msg, token) => {
  const response = {};
  if (success !== null) response.success = success;
  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;
  if (msg !== null) response.msg = msg;
  if (token !== null) response.token = token;
  return res.status(status).json(response);
};
// To ensure consistent paginated send response
otherHelper.paginationSendResponse = (
  res,
  status,
  success,
  data,
  msg,
  pageno,
  pagesize,
  totaldata,
) => {
  const response = {};
  if (data) response.data = data;
  if (success !== null) response.success = success;
  if (msg) response.msg = msg;
  if (pageno) response.page = pageno;
  if (pagesize) response.size = pagesize;
  if (typeof totaldata === 'number') response.totaldata = totaldata;
  return res.status(status).json(response);
};

// Hash user pasword before saving into the database
otherHelper.hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return { salt, hashedPassword };
};

// Validate if the user pasword match the saved password
otherHelper.validatePassword = (password, salt, hashedPassword) => {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return hashedPassword === hash;
};

// Generate the user token.
otherHelper.generateJWT = (user) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    user,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, jwtSecret);
};

// Filter user response details
otherHelper.toAuthJSON = (results) => {
  const {
    id, firstName, lastName, email, createdAt,
  } = results;
  const user = {
    id,
    firstName,
    lastName,
    email,
    createdAt,
  };
  return user;
};

module.exports = otherHelper;
