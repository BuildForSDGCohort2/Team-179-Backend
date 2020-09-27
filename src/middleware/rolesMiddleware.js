const HttpError = require('http-errors');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.roles.indexOf('admin') > -1) {
    return next();
  }
  const err = new HttpError(401);
  return next(err);
};

const isFarmer = (req, res, next) => {
  if (req.user && req.user.roles.indexOf('farmer') > -1) {
    return next();
  }
  const err = new HttpError(401);
  return next(err);
};

const isInvestor = (req, res, next) => {
  if (req.user && req.user.roles.indexOf('investor') > -1) {
    return next();
  }
  const err = new HttpError(401);
  return next(err);
};

module.exports = { isAdmin, isInvestor, isFarmer };
