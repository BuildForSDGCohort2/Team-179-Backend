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
    algorithms: ['RS256'],
    getToken: getTokenFromHeaders,
    credentialsRequired: true,
  }),
  optional: jwt({
    secret: config.jwtSecret,
    userProperty: 'payload',
    algorithms: ['RS256'],
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
  }),
};

module.exports = auth;
