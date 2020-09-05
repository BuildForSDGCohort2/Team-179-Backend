const express = require('express');
const userController = require('../../modules/users/controller');
const auth = require('../../middleware/auth');

function userRoutes(User) {
  const router = express.Router();
  const {
    createUser,
  } = userController(User);
  /**
   * @route POST api/user/register
   * @description Register user route
   * @access Public
  */
  router.route('/user/register').post(auth.optional, createUser);
  return router;
}

module.exports = userRoutes;
