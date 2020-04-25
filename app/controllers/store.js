const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc      Get single customer
// @route     GET /getCustomer
// @access    Private
exports.getStore = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Data fetched successfully',
  });
});

exports.pubKey = (req, res, next) => {
  res.status(200).json({ publishableKey: process.env.STRIPE_PUBLIC_KEY });
};
