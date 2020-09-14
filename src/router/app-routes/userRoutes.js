const express = require('express');
const userController = require('../../modules/users/userController');
const auth = require('../../middleware/auth');

function userRoutes(User, RolesAuth, Role) {
  const router = express.Router();
  const {
    createUser,
  } = userController(User, RolesAuth, Role);
  /**
   * @route POST api/user/register
   * @description Register user route
   * @access Public
  */
  router.route('/user/register').post(auth.optional, createUser);
  return router;
}

module.exports = userRoutes;
