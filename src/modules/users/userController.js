const debug = require('debug')('app:UserController');
const { Op } = require('sequelize');
const {
  postUserSchema,
  loginSchema,
  passwordResetSchema,
  forgotSchema,
  updateProfileSchema,
  createProfileSchema,
} = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');
const sendMail = require('../../helpers/emailHelper');
const roleController = require('./rolesController');

function UserController(User, Role, Profile, RoleAuth) {
  const { createRole } = roleController(Role);
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
        displayName: `${firstName} ${lastName}`,
        provider: 'Agri-Vesty',
        providerId: `${otherHelper.generateRandomHexString(20)}`,
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
        to: results.email,
        from: 'team179groupa@gmail.com',
        subject: 'Email Verification',
        html: template,
      };
      // Send email
      sendMail.send(msg);
      createRole(roles, results);
      // generate authentication token
      const token = otherHelper.generateJWT(otherHelper.toAuthJSON(results));
      return otherHelper.sendResponse(res, 201, true, null, null, 'New user registered successfully', token);
    } catch (err) {
      return next(err);
    }
  };
  const createProfile = async (req, res, next) => {
    // checks if the user submits an empty profile update
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the required details', null);
    }
    createProfileSchema.validateAsync(req.body);
    try {
      // validates the signup data from the user
      // await postUserSchema.validateAsync(req.body);
      const {
        images,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        certificateOfConduct,
      } = req.body;
      // Checks find user on the database
      const { id } = req.payload.user;
      const user = await User.findOne({ where: { id } });

      if (!user && (user.emailVerified === false)) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry there is no user to associate this profile', null);
      }
      const createdAt = new Date();
      const updatedAt = new Date();
      // creates user
      const results = await Profile.create({
        images,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        certificateOfConduct,
        createdAt,
        updatedAt,
      });
      await results.setUser(user);
      return otherHelper.sendResponse(res, 201, true, results, null, 'New user registered successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // Update user
  const updateProfile = async (req, res, next) => {
    try {
      // checks if the user submits an empty profile update
    // debug(req.body);
      if (isEmpty(req.body)) {
        return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the required details', null);
      }
      // delete id from the body to ensure you don't update id.
      if (req.body.id) {
        delete req.body.id;
      }
      updateProfileSchema.validateAsync(req.body);
      const {
        firstName,
        lastName,
        email,
        roles,
        images,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        certificateOfConduct,
      } = req.body;
      const updateUser = {
        firstName,
        lastName,
        email,
        roles,
      };
      const updateProfie = {
        images,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        certificateOfConduct,
      };
      const { id } = req.payload.user;
      const { profileId } = req.params;
      // debug(id);
      const user = await User.findOne({ where: { id } });
      const profile = await Profile.findOne({ where: { id: profileId } });
      if (!user || !profile) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry there is no user or profile to update', null);
      }
      updateUser.updatedAt = new Date();
      const userResults = await User.update(updateUser, {
        where: { id: user.id },
      });
      roles.forEach(async (item) => {
        try {
          // Search if the role id it exists. If it doesn't, respond with status 400.
          const role = await Role.findOne({ where: { role: item } });
          if (!role) {
            debug('Role does not exist');
          }
          const roleAuthFind = await RoleAuth.findOne({
            where: {
              [Op.and]: [
                { userId: user.id },
                { roleId: role.id },
              ],
            },
          });
          if (!roleAuthFind) {
            const data = {
              userId: user.id,
              roleId: role.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            const userRoleAuthCreate = await RoleAuth.create(data);
            return userRoleAuthCreate;
          }
          const dataUp = {
            userId: user.id,
            roleId: role.id,
            updatedAt: new Date(),
          };
          const userRoleAuthUpdate = await RoleAuth.update(dataUp, {
            where: {
              [Op.and]: [
                { userId: user.id },
                { roleId: role.id },
              ],
            },
          });
          return userRoleAuthUpdate;
        } catch (err) {
          return next(err);
        }
      });
      updateProfie.updatedAt = new Date();
      const ProleResults = await Profile.update(updateProfie, {
        where: { id: profile.id },
      });
      const response = [
        userResults,
        ProleResults,
      ];
      return otherHelper.sendResponse(res, 201, true, response, null, 'User updated successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds user from the database
  const findOneUser = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      // debug(req.payload);
      // const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'emailVerified',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: Role,
            as: 'roles',
          },
          {
            model: Profile,
            as: 'userProfile',
          }],
      });
      if (!user) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'User not found', null);
      }
      return otherHelper.sendResponse(res, 201, true, user, null, 'User fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds user from the database
  const findAllUsers = async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'emailVerified',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: Role,
            as: 'roles',
          },
          {
            model: Profile,
            as: 'userProfile',
          }],
      });
      if (isEmpty(users)) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'User not found', null);
      }
      return otherHelper.sendResponse(res, 201, true, users, null, 'Users fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const userBody = { email, password };
    if (!userBody) {
      res.status(422).json({
        errs: {
          success: false,
          msg: 'Please make sure you have entered all the fields',
        },
      });
    }
    try {
      await loginSchema.validateAsync(userBody);
      const user = await User.findOne({
        where: { email },
      });
      if (!user || !otherHelper.validatePassword(password, user.salt, user.password)) {
        return otherHelper.sendResponse(res, 400, true, null, null, 'password is invalid', null);
      }
      const result = otherHelper.toAuthJSON(user);
      const token = otherHelper.generateJWT(result);
      return otherHelper.sendResponse(res, 201, true, result, null, 'Logged in successfully', token);
    } catch (error) {
      return next(error);
    }
  };

  const googleLogin = (req, res) => {
    const token = otherHelper.generateJWT(otherHelper.toAuthJSON(req.user));
    return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
  };
  const facebookLogin = (req, res) => {
    const token = otherHelper.generateJWT(otherHelper.toAuthJSON(req.user));
    return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
  };
  const Verifymail = async (req, res, next) => {
    try {
      const { email } = req.payload.user;
      const { code } = req.query;
      const user = await User.findOne({
        where: {
          [Op.and]: [
            { email },
            { emailVerificationCode: code },
          ],
        },
      });
      if (!user) {
        return otherHelper.sendResponse(res, 404, false, email, null, 'Invalid Verification Code', null);
      }
      await User.update({ emailVerified: true }, {
        where: { id: user.id },
      });
      return otherHelper.sendResponse(res, 201, true, null, null, 'Email Verified', null);
    } catch (err) {
      return next(err);
    }
  };

  const ResendVerificationCode = async (req, res, next) => {
    try {
      const { email } = req.payload.user;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return otherHelper.sendResponse(res, 404, false, email, null, 'Invalid Verification Code', null);
      }
      if (user.emailVerified) {
        return otherHelper.sendResponse(res, 200, true, { email }, null, 'Email Already Verified', null);
      }
      const currentDate = new Date();
      // in minute
      const diff = parseInt((currentDate - user.emailVerificationRequestDate) / (1000 * 60), 16);
      if (diff < 10) {
        return otherHelper.sendResponse(res, 200, true, { email }, null, 'Email verification code already sent', null);
      }
      const emailVerificationCode = otherHelper.generateRandomHexString(12);
      await User.update({
        emailVerified: false,
        emailVerificationCode,
        emailVerificationRequestDate: currentDate,
      }, {
        where: { id: user.id },
      });
      // email object to be passed to sendgrind
      const template = sendMail.signUpTemplate(user.firstName, emailVerificationCode);
      const msg = {
        to: email,
        from: 'team179groupa@gmail.com',
        subject: 'Email Verification',
        html: template,
      };
        // Send email
      sendMail.send(msg);
      return otherHelper.sendResponse(res, 200, true, null, null, 'Email verification code Sent!!', null);
    } catch (err) {
      return next(err);
    }
  };
  // Provide ability to reset forgoten password
  const ForgotPassword = async (req, res, next) => {
    try {
      forgotSchema.validateAsync(req.body);
      const { email } = req.body;
      // Verify if the user exists
      const user = await User.findOne({ where: { email } });
      const data = { email };
      if (!user) {
        return otherHelper.sendResponse(res, 404, false, data, null, 'Email not found', null);
      }
      // check if time elapsed since sending the last reset code is greater than 10 min
      const currentDate = new Date();
      const diff = parseInt((currentDate - user.passwordResetRequestDate) / (1000 * 60), 16);
      if (diff < 10) {
        return otherHelper.sendResponse(res, 200, true, { email }, null, 'Email password reset code already sent', null);
      }
      const passwordResetCode = otherHelper.generateRandomHexString(6);
      await User.update({
        passwordResetCode,
        passwordResetRequestDate: currentDate,
      }, {
        where: { id: user.id },
      });
      // email object to be passed to sendgrind
      const template = sendMail.signUpTemplate(user.firstName, passwordResetCode);
      const msg = {
        to: email,
        from: 'team179groupa@gmail.com',
        subject: 'Email Verification',
        html: template,
      };
        // Send email
      sendMail.send(msg);
      return otherHelper.sendResponse(res, 200, true, null, null, `Password Reset Code For ${email} is sent to email`, null);
    } catch (err) {
      return next(err);
    }
  };
  // Reset password using the code sent to the email
  const ResetPassword = async (req, res, next) => {
    try {
      await passwordResetSchema.validateAsync(req.body);
      const { email, password } = req.body;
      const { code } = req.query;
      // verify the user email and reset code
      const user = await User.findOne({
        where: {
          [Op.and]: [
            { email },
            { passwordResetCode: code },
          ],
        },
      });
      const data = { email };
      if (!user) {
        return otherHelper.sendResponse(res, 404, false, data, null, 'Invalid Password Reset Code', null);
      }
      const { salt, hashedPassword } = otherHelper.hashPassword(password);
      // Update password
      const result = await User.update({
        salt,
        password: hashedPassword,
        emailVerified: true,
      }, {
        where: { id: user.id },
      });
      // generate token for the user.
      const results = otherHelper.toAuthJSON(result);
      const token = otherHelper.generateJWT(results);
      return otherHelper.sendResponse(res, 200, true, results, null, null, token);
    } catch (err) {
      return next(err);
    }
  };
  const changePassword = async (req, res, next) => {
    try {
      // debug(req.payload);
      const { id } = req.payload.user;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({
        where: { id },
      });
      if (otherHelper.validatePassword(oldPassword, user.salt, user.password)) {
        const { salt, hashedPassword } = otherHelper.hashPassword(newPassword);
        const results = await User.update({
          salt,
          password: hashedPassword,
        }, {
          where: { id: user.id },
        });
        const result = otherHelper.toAuthJSON(results);
        return otherHelper.sendResponse(res, 200, true, result, null, 'Password Change Success', null);
      }
      return otherHelper.sendResponse(res, 400, false, null, null, 'Old Password incorrect', null);
    } catch (err) {
      return next(err);
    }
  };
  const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      const roles = await User.getRoles();
      User.removeRoles(roles);
      await User.destroy({
        where: { id },
      });
      return otherHelper.sendResponse(res, 204, true, {}, null, 'User deleted successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    createUser,
    updateProfile,
    findOneUser,
    createProfile,
    findAllUsers,
    signIn,
    googleLogin,
    facebookLogin,
    Verifymail,
    ResendVerificationCode,
    ForgotPassword,
    ResetPassword,
    changePassword,
    deleteUser,

  };
  return controller;
}

module.exports = UserController;
