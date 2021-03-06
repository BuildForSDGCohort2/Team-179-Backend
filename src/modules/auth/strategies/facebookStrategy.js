const { Strategy } = require('passport-facebook');
const passport = require('passport');
// const debug = require('debug')('app:FacebookStrategy');
const config = require('../../../appconfigs/config')();
// const otherHelper = require('../../../helpers/otherhelpers');
const sendMail = require('../../../helpers/emailHelper');

module.exports = (User) => {
  const strategyOptions = {
    clientID: config.facebookID,
    clientSecret: config.facebookSecret,
    callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'email'],
  };
  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({
        where: { providerId: profile.id },
      });
      if (user) {
        return done(null, user);
      }
      // debug(profile);
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
        roles,
        email: profile.emails[0].value,
        provider: profile.provider,
        providerId: profile.id,
        emailVerified,
        emailVerificationRequestDate,
        createdAt,
        updatedAt,
      };
      // debug(data);
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
      return done(null, results);
    } catch (err) {
      // debug('err:', err);
      return done(err, null);
    }
  };
  passport.use(new Strategy(strategyOptions, verifyCallback));
};
