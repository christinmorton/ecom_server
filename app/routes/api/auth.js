const express = require('express');
const { forgotPassword, resetUserPassword } = require('../controllers/auth');

// Include other resource routers
// const someRouter = require('./anotherRoute');

const router = express.Router();

// Re-route into other resource routers
// router.use('/:someId/anotherRoute', anotherRoute);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword').post(resetUserPassword);

module.exports = router;
