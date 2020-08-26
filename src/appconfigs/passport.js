const passport = require('passport');

module.exports = function passportFunction(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  // Stores users in the sesion
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // Retrive users from the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
