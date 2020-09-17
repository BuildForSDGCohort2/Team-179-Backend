const JWTStrategy = require('./jwtStrategy');
const GoogleStrategy = require('./googleStrategy');
const FacebookStrategy = require('./facebookStrategy');

function strategies(User) {
  const { jwtStrategy } = JWTStrategy(User);
  const allStrategy = { jwtStrategy, GoogleStrategy, FacebookStrategy };
  return allStrategy;
}
module.exports = strategies;
