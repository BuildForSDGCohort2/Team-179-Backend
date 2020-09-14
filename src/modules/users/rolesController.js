// const debug = require('debug')('app:UserController');
const { postRolechema } = require('./validation');
const otherHelper = require('../../helpers/otherhelpers');
const isEmpty = require('../../helpers/isEmpty');

function RoleController(Role) {
  const createRole = async (req, res, next) => {
    // checks if the user submits an empty register request
    // debug(req.body);
    if (isEmpty(req.body)) {
      return otherHelper.sendResponse(res, 422, false, null, null, 'please enter all the details', null);
    }
    try {
      // validates the role data from the user
      await postRolechema.validateAsync(req.body);
      const {
        role, description,
      } = req.body;
      const createdAt = new Date();
      const updatedAt = new Date();
      // creates role
      const results = await Role.create({
        role, description, createdAt, updatedAt,
      });
      return otherHelper.sendResponse(res, 201, true, results, null, 'New role created successfully', null);
    } catch (err) {
      return next(err);
    }
  };
  const controller = {
    createRole,
  };
  return controller;
}

module.exports = RoleController;
