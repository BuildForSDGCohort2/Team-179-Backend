const debug = require('debug')('app:Express');
const config = require('../appconfigs/config')();

const isProduction = config.env === 'production';
// eslint-disable-next-line no-unused-vars
const errorHelper = (err, req, res, next) => {
  if (!isProduction) {
    debug(err);
  }
  const is404 = err.toLowerCase().endsWith('not found');
  const statusCode = is404 ? 404 : 400;
  switch (true) {
    case typeof err === 'string':
      // custom application error
      return res.status(statusCode).json({ message: err });
    case err.isJoi:
      // customize Joi validation errors
      return res.status(400).json({ message: err.details.map((e) => e.message).join(';') });
    case err.name === 'UnauthorizedError':
      // jwt authentication error
      return res.status(401).json({ message: 'Unauthorized' });
    default:
      return res.status(500).json({ message: err.message });
  }
};
module.exports = errorHelper;
