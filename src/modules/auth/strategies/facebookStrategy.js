const { Strategy } = require('passport-facebook');
const passport = require('passport');
const debug = require('debug')('app:FacebookStrategy');
const config = require('../../../appconfigs/config')();
// const otherHelper = require('../../../helpers/otherhelpers');
const sendMail = require('../../../helpers/emailHelper');
const roleController = require('../../users/rolesController');

module.exports = (User, Role) => {
  const { createRole } = roleController(Role);
  const strategyOptions = {
    clientID: config.facebookID,
    clientSecret: config.facebookSecret,
    callbackURL: `${config.serverUrl}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails'],
  };
  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({
        where: { providerId: profile.id },
      });
      if (user) {
        return done(null, user);
      }
      // Extract the minimal profile information we need from the profile object
      const emailVerified = true;
      const emailVerificationRequestDate = new Date();
      const createdAt = new Date();
      const updatedAt = new Date();
      const roles = ['client'];
      const data = {
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        provider: profile.provider,
        providerId: profile.id,
        emailVerified,
        emailVerificationRequestDate,
        createdAt,
        updatedAt,
      };
      const results = await User.create(data);
      // email object to be passed to sendgrind
      const template = sendMail.authTemplate(results.firstName);
      const msg = {
        to: results.email,
        from: 'team179groupa@gmail.com',
        subject: 'Email Verification',
        html: template,
      };
      // Send email
      sendMail.send(msg);
      createRole(roles, results);
      return done(null, results);
    } catch (err) {
      debug('err:', err);
      return done(err, null);
    }
  };
  passport.use(new Strategy(strategyOptions, verifyCallback));
};
