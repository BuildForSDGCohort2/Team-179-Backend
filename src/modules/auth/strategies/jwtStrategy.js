const passport = require('passport');
const { Strategy } = require('passport-jwt');
// const debug = require('debug')('app:JwtStategy');
const config = require('../../../appconfigs/config')();

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if ((authorization && authorization.split(' ')[0] === 'Bearer') || (authorization && authorization.split(' ')[0] === 'Token')) {
    return authorization.split(' ')[1];
  }
  return null;
};
module.exports = (User) => {
  const strategyOptions = {
    jwtFromRequest: (req) => getTokenFromHeaders(req),
    secretOrKey: config.jwtSecret,
    passReqToCallback: true,
  };
  const verifyCallback = async (req, payload, cb) => {
    try {
      // debug(jwtPayload);
      const user = await User.findOne({
        where: { id: payload.user.id },
      });
      req.user = user;
      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  };
  passport.use(new Strategy(strategyOptions, verifyCallback));
};
