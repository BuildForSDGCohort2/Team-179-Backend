const debug = require('debug')('app:UserController');
const { Op } = require('sequelize');
const {
  postUserSchema,
  loginSchema,
  passwordResetSchema,
  forgotSchema,
  updateProfileSchema,
  createProfileSchema,
  changePasswordSchema,
} = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');
const sendMail = require('../../helpers/emailHelper');

function UserController(
  User, Profile, Farm, Location, Project, ProjectFavs, ProjectComments, Sequelize, RefreshToken,
) {
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
        firstName, lastName, email, password,
      } = req.body;
      const roles = ['client'];
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
        roles,
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
      // generate authentication token
      const result = otherHelper.toAuthJSON(results);
      // Generate refresh token a authorization token
      const token = await otherHelper.generateJWT(result);
      const refreshToken = await otherHelper.generateRefreshToken(RefreshToken, results);
      // set cookie
      otherHelper.setTokenCookie(res, refreshToken.refToken);
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
    try {
      // validates the profile data from the user
      await createProfileSchema.validateAsync(req.body);
      let { image } = req.body;
      const {
        bios,
        phoneNumber,
        gender,
        roles,
        dateOfBirth,
        idNumber,
        kraPin,
      } = req.body;
      // Checks find user on the database
      const { id } = req.payload.user;
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry there is no user to associate this profile', null);
      }
      if (req.file) {
        // debug(req.file);
        const url = `${req.protocol}://${req.get('host')}`;
        image = `${url}/public/uploads/${req.file.filename}`;
      }
      const createdAt = new Date();
      const updatedAt = new Date();
      // roles = user.roles.push(roles);
      // debug(user.roles);
      // creates user
      const results = await Profile.create({
        image,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        createdAt,
        updatedAt,
      });
      const updateUser = {
        roles: (user.roles.indexOf('admin') > -1) ? user.roles : Sequelize.fn('array_append', Sequelize.col('roles'), roles),
      };
      updateUser.updatedAt = new Date();
      await User.update(updateUser, {
        where: { id },
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
      // if (typeof req.body.roles === 'string' && !(req.body.roles.trim().length === 0)) {
      //   req.body.roles = req.body.roles.split(',');
      // }
      // debug(req.body.roles);
      await updateProfileSchema.validateAsync(req.body);
      let { image } = req.body;
      const {
        firstName,
        lastName,
        email,
        bios,
        phoneNumber,
        gender,
        roles,
        dateOfBirth,
        idNumber,
        kraPin,
      } = req.body;
      if (req.file) {
        // debug(req.file);
        const url = `${req.protocol}://${req.get('host')}`;
        image = `${url}/public/uploads/${req.file.filename}`;
      }
      const { id } = req.payload.user;
      const { profileId } = req.params;
      const user = await User.findOne({ where: { id } });
      const profile = await Profile.findOne({ where: { id: profileId } });
      if (!user || !profile) {
        return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry there is no user or profile to update', null);
      }
      const updateUser = {
        firstName,
        lastName,
        email,
        roles: (user.roles.includes('admin')) ? user.roles : Sequelize.fn('array_append', Sequelize.col('roles'), roles),
        updatedAt: new Date(),
      };
      const updateProfie = {
        image,
        bios,
        phoneNumber,
        gender,
        dateOfBirth,
        idNumber,
        kraPin,
        updatedAt: new Date(),
      };
      await User.update(updateUser, {
        where: { id: user.id },
      });
      await Profile.update(updateProfie, {
        where: { id: profile.id },
      });
      return otherHelper.sendResponse(res, 201, true, null, null, 'User updated successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // finds user from the database
  const findUserProfile = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      // debug(req.payload.user);
      // const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'roles',
          'emailVerified',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: Profile,
            as: 'userProfile',
          },
          {
            model: Farm,
            as: 'farms',
            include: [
              {
                model: Location,
                as: 'location',
              }],
          },
          {
            model: Project,
            as: 'projects',
          },
          {
            model: ProjectFavs,
            as: 'favourites',
          },
          {
            model: ProjectComments,
            as: 'comments',
          },
        ],
      });
      if (!user) {
        return otherHelper.sendResponse(res, 400, false, null, null, 'User profile not found', null);
      }
      return otherHelper.sendResponse(res, 201, true, user, null, 'User Profile fetched successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  // find current user
  const findUserLoggedIn = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      // debug(req.payload.user);
      // const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'roles',
          'emailVerified',
          'createdAt',
          'updatedAt',
        ],
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
    let { offset, limit } = req.query;
    try {
      limit = Math.abs(parseInt(limit, 10));
      offset = Math.abs(parseInt(offset, 10)) * limit;
      // debug(limit, offset);
      const users = await User.findAndCountAll({
        where: {},
        limit,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ],
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'emailVerified',
          'createdAt',
          'updatedAt',
        ],
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
        return otherHelper.sendResponse(res, 400, true, null, null, 'Email or password is invalid', null);
      }
      const result = otherHelper.toAuthJSON(user);
      // Generate refresh token a authorization token
      const token = otherHelper.generateJWT(result);
      const refreshToken = await otherHelper.generateRefreshToken(RefreshToken, user);
      // debug(refreshToken);
      // set cookie
      otherHelper.setTokenCookie(res, refreshToken.refToken);
      return otherHelper.sendResponse(res, 201, true, null, null, 'Logged in successfully', token);
    } catch (error) {
      return next(error);
    }
  };
  const googleLogin = async (req, res, next) => {
    try {
      const token = otherHelper.generateJWT(otherHelper.toAuthJSON(req.user));
      const refreshToken = await otherHelper.getRefreshToken(RefreshToken, req.user);
      // set cookie
      otherHelper.setTokenCookie(res, refreshToken.refToken);
      return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
    } catch (error) {
      return next(error);
    }
  };
  const facebookLogin = async (req, res, next) => {
    try {
      const token = otherHelper.generateJWT(otherHelper.toAuthJSON(req.user));
      const refreshToken = await otherHelper.getRefreshToken(RefreshToken, req.user);
      // set cookie
      otherHelper.setTokenCookie(res, refreshToken.refToken);
      return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
    } catch (error) {
      return next(error);
    }
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
      await forgotSchema.validateAsync(req.body);
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
      const template = sendMail.resetPassword(user.firstName, passwordResetCode);
      const msg = {
        to: email,
        from: 'team179groupa@gmail.com',
        subject: 'Password Reset',
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
      const { email, password, code } = req.body;
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
      return otherHelper.sendResponse(res, 200, true, null, null, 'Password reset successfull', token);
    } catch (err) {
      return next(err);
    }
  };
  const changePassword = async (req, res, next) => {
    try {
      debug(req.body);
      await changePasswordSchema.validateAsync(req.body);
      const { id } = req.payload.user;
      const { oldPassword, password } = req.body;
      const user = await User.findOne({
        where: { id },
      });
      if (otherHelper.validatePassword(oldPassword, user.salt, user.password)) {
        const { salt, hashedPassword } = otherHelper.hashPassword(password);
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
    findUserLoggedIn,
    findUserProfile,
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
