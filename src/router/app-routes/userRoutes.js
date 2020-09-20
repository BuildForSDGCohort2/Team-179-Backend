const express = require('express');
const passport = require('passport');
const userController = require('../../modules/users/userController');
const auth = require('../../middleware/auth');

function userRoutes(User, Role, Profile, RolesAuth, Farm, Location) {
  const router = express.Router();
  const {
    createUser,
    findOneUser,
    createProfile,
    updateProfile,
    findAllUsers,
    googleLogin,
    signIn,
    facebookLogin,
    Verifymail,
    ResendVerificationCode,
    ForgotPassword,
    ResetPassword,
    changePassword,
    deleteUser,
  } = userController(User, Role, Profile, RolesAuth, Farm, Location);

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
  router.route('/user/profile').get(auth, findOneUser);

  /**
   * @route Put api/user/list
   * @description get users list
   * @access Private
  */
  router.route('/users/list').get(auth, findAllUsers);

  /**
   * @route Put /auth/google
   * @description sign in using google
   * @access Public
  */
  router.route('/auth/google').get(
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
  router.route('/auth/google/callback').get(passport.authenticate('google'), googleLogin);

  /**
   * @route Put /auth/facebook/callback
   * @description sign in using facebook
   * @access Public
  */
  router.route('/auth/facebook').get(passport.authenticate('facebook', { scope: 'email' }));

  /**
   * @route Put /auth/facebook/callback
   * @description sign in using facebook
   * @access Public
  */
  router.route('/auth/facebook/callback').get(passport.authenticate('facebook', { failureRedirect: '/login' }), facebookLogin);

  /**
   * @route Put /auth/login
   * @description sign in using Passport-JWT
   * @access Public
  */
  router.route('/auth/login').post(signIn);

  /**
   * @route Put /user/change-password
   * @description Change user password
   * @access Private
  */
  router.route('/user/change-password').patch(auth, changePassword);

  /**
   * @route Put /user/verify-email
   * @description Verify code using given code on params
   * @access Private
  */
  router.route('/user/verify-email').patch(auth, Verifymail);

  /**
   * @route Put /users/resend-verification
   * @description sign in using Passport-JWT
   * @access Private
  */
  router.route('/users/resend-verification').patch(auth, ResendVerificationCode);

  /**
   * @route Put /user/forgot-password
   * @description Send email with a code to change password
   * @access Public
  */
  router.route('/user/forgot-password').patch(ForgotPassword);

  /**
   * @route Put /user/password-reset
   * @description Reset Password
   * @access Public
  */
  router.route('/user/password-reset').patch(ResetPassword);

  /**
   * @route Put /user/delete
   * @description Delete User
   * @access Private
  */
  router.route('/user/delete').delete(auth, deleteUser);
  return router;
}

module.exports = userRoutes;
