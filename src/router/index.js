const express = require('express');
const {
  User,
  Role,
  RolesAuth,
  Profile,
  Farm,
  Location,
} = require('../database/models');
const userRoutes = require('./app-routes/userRoutes');
const farmRoutes = require('./app-routes/farmsRoutes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));
router.use('/', userRoutes(User, Role, Profile, RolesAuth, Farm, Location));
router.use('/', farmRoutes(Farm, Location));

module.exports = router;
