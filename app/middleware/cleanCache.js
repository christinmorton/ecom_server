const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { clearHash } = require('../utils/cache');

// dump the cache after the resources are created/delivered.

module.exports = asyncHandler(async (req, res, next) => {
  await next();

  clearHash(req.user.id);
});
