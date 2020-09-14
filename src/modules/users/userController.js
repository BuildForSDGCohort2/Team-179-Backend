const debug = require('debug')('app:UserController');
const uuid = require('uuid');
const { postUserSchema } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');
const sendMail = require('../../helpers/emailHelper');

function UserController(User, RolesAuth, Role) {
  const createUser = async (req, res, next) => {
    // checks if the user submits an empty register request
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
    }
    try {
      // validates the signup data from the user
      await postUserSchema.validateAsync(req.body);
      let {
        // eslint-disable-next-line prefer-const
        firstName, lastName, email, password, roles,
      } = req.body;
      // Checks if the user exists on the database e6b397ec-14ba-4cc6-8719-e9ff03d54139
      const dbUser = await User.findOne({ where: { email } });

      if (dbUser) {
        return otherHelper.sendResponse(res, 404, false, null, null, `${email} is already taken`, null);
      }
      const { salt, hashedPassword } = otherHelper.hashPassword(password);
      const emailVerificationCode = otherHelper.generateRandomHexString(20);
      const emailVerified = false;
      const emailVerificationRequestDate = new Date();
      const createdAt = new Date();
      const updatedAt = new Date();
      password = hashedPassword;
      // creates user
      const results = await User.create({
        firstName,
        lastName,
        email,
        password,
        salt,
        emailVerificationCode,
        emailVerified,
        emailVerificationRequestDate,
        createdAt,
        updatedAt,
      });
      // email object to be passed to sendgrind
      const template = sendMail.signUpTemplate(firstName, emailVerificationCode);
      const msg = {
        to: email,
        from: 'mbogokennedy@gmail.com',
        subject: 'Email Verification',
        html: template,
      };
      // Send email
      sendMail.send(msg);
      // Loop through all the id in req.role
      roles.forEach(async (roleId) => {
        // Search if the role id it exists. If it doesn't, respond with status 400.
        const bytes = uuid.parse(roleId);
        const id = uuid.stringify(bytes);
        try {
          const role = await Role.findOne({ where: { id } });
          if (!role) {
            debug('Role does not exist');
          }
          // Create a dictionary with which to create the role-user Association
          const roleAuth = {
            userId: results.id,
            roleId: id,
          };

          // Create and save a roleAuth
          const saveRoleAuth = await RolesAuth.create(roleAuth);
          return saveRoleAuth;
        } catch (err) {
          return next(err);
        }
      });
      // generate authentication token
      const token = otherHelper.generateJWT(otherHelper.toAuthJSON(results));
      return otherHelper.sendResponse(res, 201, true, otherHelper.toAuthJSON(results), null, 'New user registered successfully', token);
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    createUser,
  };
  return controller;
}

module.exports = UserController;
