const express = require('express');
const { User } = require('../database/models');
const userRoutes = require('./app-routes/userRoutes');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));
router.use('/', userRoutes(User));

module.exports = router;
