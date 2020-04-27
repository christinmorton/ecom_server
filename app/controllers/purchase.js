const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      POST create a purchase
// @route     POST /initorder/:orderId
// @access    Private
