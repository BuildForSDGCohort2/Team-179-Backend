const jwt = require('express-jwt');
const config = require('../appconfigs/config')();

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if ((authorization && authorization.split(' ')[0] === 'Bearer') || (authorization && authorization.split(' ')[0] === 'Token')) {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: config.jwtSecret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: config.jwtSecret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
