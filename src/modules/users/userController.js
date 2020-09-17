const debug = require('debug')('app:UserController');
const { Op } = require('sequelize');
const { postUserSchema } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');
const sendMail = require('../../helpers/emailHelper');
const JWTStrategy = require('../auth/strategies/jwtStrategy');
const roleController = require('./rolesController');

function UserController(User, Role, Profile, RoleAuth) {
  const { createRole } = roleController(Role);
  const { login } = JWTStrategy(User);
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
      // const token = otherHelper.generateJWT(results.id, email);
      const [loginErr, token] = await login(req, otherHelper.toAuthJSON(results));
      if (loginErr) {
        debug(loginErr);
        return otherHelper.sendResponse(res, 500, true, null, null, 'Authentication Failed!', token);
      }
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
      const { id } = req.payload;
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
      // delete id from the body to ensure you don't update id.
      if (req.body.id) {
        delete req.body.id;
      }
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
      const { payload: { id } } = req;
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
  const findUser = async (req, res, next) => {
    try {
      const { payload: { id } } = req;
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
  const findUsers = async (req, res, next) => {
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
  const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = User.findOne({
      where: { email },
    });
    if (!user || !otherHelper.validatePassword(password, user.salt, user.password)) {
      return otherHelper.sendResponse(res, 400, true, null, null, 'password is invalid', null);
    }

    const [loginErr, token] = await login(req, otherHelper.toAuthJSON(user));

    if (loginErr) {
      debug(loginErr);
      return otherHelper.sendResponse(res, 500, true, null, null, 'Authentication Failed!', null);
    }
    return otherHelper.sendResponse(res, 201, true, null, null, 'Logged in successfully', token);
  };
  const googleLogin = (req, res) => {
    const token = otherHelper.generateJWT(req.user);
    return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
  };
  const facebookLogin = (req, res) => {
    const token = otherHelper.generateJWT(req.user);
    return otherHelper.sendResponse(res, 201, true, null, null, 'New user logged in successfully', token);
  };
  const controller = {
    createUser,
    updateProfile,
    findUser,
    createProfile,
    findUsers,
    signIn,
    googleLogin,
    facebookLogin,
  };
  return controller;
}

module.exports = UserController;
