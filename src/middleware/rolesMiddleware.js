const HttpError = require('http-errors');
const otherHelper = require('../helpers/otherhelpers');

function RolesMiddleware(User) {
  const isAdmin = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      const user = await User.findOne({ where: { id } });

      if (user && req.user.roles.includes('admin')) {
        return next();
      }
      return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry ensure you logged in', null);
    } catch (error) {
      const err = new HttpError(401);
      return next(err);
    }
  };

  const isFarmer = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      const user = await User.findOne({ where: { id } });

      if (user && req.user.roles.includes('farmer')) {
        return next();
      }
      return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry ensure you logged in', null);
    } catch (error) {
      const err = new HttpError(401);
      return next(err);
    }
  };

  const isInvestor = async (req, res, next) => {
    try {
      const { id } = req.payload.user;
      const user = await User.findOne({ where: { id } });

      if (user && req.user.roles.includes('investor')) {
        return next();
      }
      return otherHelper.sendResponse(res, 404, false, null, null, 'Sorry ensure you logged in', null);
    } catch (error) {
      const err = new HttpError(401);
      return next(err);
    }
  };

  const mid = { isAdmin, isInvestor, isFarmer };
  return mid;
}

module.exports = RolesMiddleware;
