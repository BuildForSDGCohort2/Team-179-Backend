// // const jwt = require('express-jwt');
// // const jwt = require('jsonwebtoken');
// // const config = require('../appconfigs/config')();

// // const getTokenFromHeaders = (req) => {
// //   const { headers: { authorization } } = req;

// //   if ((authorization && authorization.split(' ')[0] === 'Bearer')
// //   || (authorization && authorization.split(' ')[0] === 'Token')) {
// //     return authorization.split(' ')[1];
// //   }
// //   return null;
// // };

// // const auth = (req, res, next) => {
// //   const token = getTokenFromHeaders(req);
// //   try {
// //     const payload = jwt.verify(token, config.jwtSecret);
// //     req.payload = payload;
// //     next();
// //   } catch (error) {
// //     next(error);
// //   }
// // };
// // const auth = {
// //   required: jwt({
// //     secret: config.jwtSecret,
// //     userProperty: 'payload',
// //     algorithms: ['RS256'],
// //     getToken: getTokenFromHeaders,
// //   }),
// //   optional: jwt({
// //     secret: config.jwtSecret,
// //     userProperty: 'payload',
// //     algorithms: ['RS256'],
// //     credentialsRequired: false,
// //     getToken: getTokenFromHeaders,
// //   }),
// // };

// module.exports = auth;
