const express = require('express');
const {
  User,
  Role,
  RolesAuth,
  Profile,
} = require('../database/models');
const userRoutes = require('./app-routes/userRoutes');
const rolesRoutes = require('./app-routes/rolesRoutes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));
router.use('/', userRoutes(User, Role, Profile, RolesAuth));
router.use('/', rolesRoutes(Role));

module.exports = router;
