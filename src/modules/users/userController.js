const debug = require('debug')('app:UserController');
const { Op } = require('sequelize');
const { postUserSchema } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');
const sendMail = require('../../helpers/emailHelper');

function UserController(User, Role, Profile, RoleAuth) {
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
      roles.forEach(async (item) => {
        try {
          // Search if the role id it exists. If it doesn't, respond with status 400.
          const role = await Role.findOne({ where: { role: item } });
          if (!role) {
            debug('Role does not exist');
          }
          await results.setRoles(role);
          return;
        } catch (err) {
          next(err);
        }
      });
      // generate authentication token
      const token = otherHelper.generateJWT(results.id, email);
      return otherHelper.sendResponse(res, 201, true, otherHelper.toAuthJSON(results), null, 'New user registered successfully', token);
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
  const controller = {
    createUser, updateProfile, findUser, createProfile, findUsers,
  };
  return controller;
}

module.exports = UserController;
