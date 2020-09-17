const express = require('express');
const passport = require('passport');
const userController = require('../../modules/users/userController');
// const auth = require('../../middleware/auth');

function userRoutes(User, Role, Profile, RolesAuth) {
  const router = express.Router();
  const {
    createUser,
    findUser,
    createProfile,
    updateProfile,
    findUsers,
    googleLogin,
    signIn,
    facebookLogin,
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
  router.route('/user/create-profile').post(createProfile);
  /**
   * @route Put api/user/update-profile/:profileId
   * @description updte user profile route
   * @access Private
  */
  router.route('/user/update-profile/:profileId').put(updateProfile);
  /**
   * @route Put api/user/profile
   * @description get user details
   * @access Private
  */
  router.route('/user/profile').get(findUser);
  /**
   * @route Put api/user/list
   * @description get users list
   * @access Private
  */
  router.route('/users/list').get(findUsers);
  /**
   * @route Put /auth/google
   * @description sign in using google
   * @access Public
  */
  router.route('api/auth/google').get(
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    }),
  );
  /**
   * @route Put /auth/google/callback
   * @description sign in using google
   * @access Public
  */
  router.route('/auth/google/callback').get(passport.authenticate('google', { failureRedirect: '/login' }), googleLogin);
  /**
   * @route Put /auth/login
   * @description sign in using Passport-JWT
   * @access Public
  */
  router.route('/auth/login').get(signIn);
  /**
   * @route Put /auth/facebook/callback
   * @description sign in using facebook
   * @access Public
  */
  router.route('/auth/facebook').get(passport.authenticate('facebook'));
  /**
   * @route Put /auth/facebook/callback
   * @description sign in using facebook
   * @access Public
  */
  router.route('/auth/facebook/callback').get(passport.authenticate('facebook', { failureRedirect: '/login' }), facebookLogin);
  return router;
}

module.exports = userRoutes;
