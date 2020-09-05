// const debug = require('debug')('app:UserController');
const { postUserSchema } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');

function UserController(User) {
  // Checks if the user exists on the database and then creates user
  const createUser = async (req, res, next) => {
    try {
      // checks if the user submits an empty register request
      // debug(req.body);
      if (!req.body) {
        return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
      }
      // validates the dat from the user
      await postUserSchema.validateAsync(req.body);
      let {
        // eslint-disable-next-line prefer-const
        firstName, lastName, email, password,
      } = req.body;
      const dbUser = await User.findOne({ where: { email } });
      if (dbUser) {
        return otherHelper.sendResponse(res, 404, false, null, null, `${email} is already taken`, null);
      }
      const id = otherHelper.generateRandomHexString(20);
      const { salt, hashedPassword } = otherHelper.hashPassword(password);
      const token = otherHelper.generateJWT(id, email);
      const emailVerificationCode = otherHelper.generateRandomHexString(20);
      const emailVerified = false;
      const emailVerificationRequestDate = new Date();
      const createdAt = new Date();
      const updatedAt = new Date();
      password = hashedPassword;
      const results = await User.create({
        id,
        firstName,
        lastName,
        email,
        password,
        salt,
        token,
        emailVerificationCode,
        emailVerified,
        emailVerificationRequestDate,
        createdAt,
        updatedAt,
      });
      // debug(results);
      return otherHelper.sendResponse(res, 201, true, results, null, 'Registered successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  return {
    createUser,
  };
}

module.exports = UserController;
