const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get single customer
// @route     GET /getCustomer
// @access    Private
exports.getStore = asyncHandler(async (req, res, next) => {
  // Read the JSON files
  const Items = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
  );

  if (!Items) {
    return next(new ErrorResponse(`Items are not found, Server error...`, 500));
  }

  res.render('store.ejs', {
    success: true,
    message: `Items loaded successfully`,
    items: Items,
  });
});
