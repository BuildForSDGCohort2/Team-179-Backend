const express = require('express');
const { User, Role, RolesAuth } = require('../database/models');
const userRoutes = require('./app-routes/userRoutes');
const rolesRoutes = require('./app-routes/rolesRoutes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));
router.use('/', userRoutes(User, RolesAuth, Role));
router.use('/', rolesRoutes(Role));

module.exports = router;
