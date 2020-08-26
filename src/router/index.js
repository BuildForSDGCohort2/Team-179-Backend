const express = require('express');

const router = express.Router();

router.get('/health-check', (req, res) => res.send('This API is Okay'));

module.exports = router;
