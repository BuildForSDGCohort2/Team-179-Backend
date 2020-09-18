const passport = require('passport');
const {
  User, Role,
} = require('../../database/models');
const { GoogleStrategy, FacebookStrategy } = require('./strategies');

// const pipe = (...functions) => (args) => functions.reduce((arg, fn) => fn(arg), args);
const passportFunction = (app) => {
  // JWTStrategy();
  GoogleStrategy(User, Role);
  FacebookStrategy(User, Role);
  app.use(passport.initialize());
  app.use(passport.session());
  // Stores users in the sesion
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // Retrive users from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
};

module.exports = passportFunction;
