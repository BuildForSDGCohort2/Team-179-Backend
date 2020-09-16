const express = require('express');
const userController = require('../../modules/users/userController');
const auth = require('../../middleware/auth');

function userRoutes(User, Role, Profile, RolesAuth) {
  const router = express.Router();
  const {
    createUser, findUser, createProfile, updateProfile, findUsers,
  } = userController(User, Role, Profile, RolesAuth);
  /**
   * @route POST api/user/register
   * @description Register user route
   * @access Public
  */
  router.route('/user/register').post(createUser);
  /**
   * @route POST api/user/create-profile
   * @description create user profile route
   * @access Private
  */
  router.route('/user/create-profile').post(auth, createProfile);
  /**
   * @route Put api/user/update-profile/:profileId
   * @description updte user profile route
   * @access Private
  */
  router.route('/user/update-profile/:profileId').put(auth, updateProfile);
  /**
   * @route Put api/user/profile
   * @description get user details
   * @access Private
  */
  router.route('/user/profile').get(auth, findUser);
  /**
   * @route Put api/user/list
   * @description get users list
   * @access Private
  */
  router.route('/users/list').get(auth, findUsers);
  return router;
}

module.exports = userRoutes;
