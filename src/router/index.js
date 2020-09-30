const express = require('express');
const {
  User,
  Role,
  RolesAuth,
  Profile,
  Farm,
  Location,
  MpesaB2C,
  MpesaC2B,
  MpesaLNM,
  Project,
  ProjectFavs,
  ProjectComments,
  ProjectInvestments,
} = require('../database/models');
const userRoutes = require('./app-routes/userRoutes');
const farmRoutes = require('./app-routes/farmsRoutes');
const paymentsRoutes = require('./app-routes/paymentRoutes');
const projectsRoutes = require('./app-routes/projectRoutes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));
router.use('/', userRoutes(User, Role, Profile, RolesAuth, Farm, Location, Project, ProjectFavs, ProjectComments));
router.use('/', farmRoutes(Farm, Location, User));
router.use('/', paymentsRoutes(MpesaB2C, MpesaC2B, MpesaLNM, User, Project, ProjectInvestments));
router.use('/', projectsRoutes(Project, User, Farm, Location, ProjectComments, ProjectFavs));

module.exports = router;
