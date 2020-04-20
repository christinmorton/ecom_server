const express = require('express');
const { login, logout, register } = require('../../controllers/users');

// const User = require('../../models/User');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/login').get(login);
router.route('/logout').get(ensureAuthenticated, logout);
router.route('/register').get(register);

module.exports = router;
