const passport = require('passport');
const { Strategy } = require('passport-jwt');
// const debug = require('debug')('app:JwtStategy');
const config = require('../../../appconfigs/config')();
const otherHelper = require('../../../helpers/otherhelpers');

// const getUserById = require('../users');
// const signToken = require('../utils');

function JWTStategy(User) {
  const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
    if ((authorization && authorization.split(' ')[0] === 'Bearer') || (authorization && authorization.split(' ')[0] === 'Token')) {
      return authorization.split(' ')[1];
    }
    return null;
  };
  const jwtStrategy = () => {
    const strategyOptions = {
      jwtFromRequest: (req) => getTokenFromHeaders(req),
      secretOrKey: config.jwtSecret,
      passReqToCallback: true,
    };
    const verifyCallback = async (req, jwtPayload, cb) => {
      try {
        const user = await User.findOne({
          where: { id: jwtPayload.data.id },
        });
        req.user = user;
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    };
    passport.use(new Strategy(strategyOptions, verifyCallback));
  };

  const login = (req, user) => new Promise((resolve, reject) => {
    req.login(user, { session: false }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(otherHelper.generateJWT(user));
    });
  });
  const auth = { jwtStrategy, login };
  return auth;
}

module.exports = JWTStategy;
