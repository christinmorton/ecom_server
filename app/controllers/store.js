const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc      Get single customer
// @route     GET /getCustomer
// @access    Private
exports.getStore = asyncHandler(async (req, res, next) => {
  // Read the JSON files
  const Items = {
    music: [
      {
        id: 1,
        name: 'Album 1',
        price: 1299,
        imgName: 'Album1.png',
      },
      {
        id: 2,
        name: 'Album 2',
        price: 1499,
        imgName: 'Album2.png',
      },
      {
        id: 3,
        name: 'Album 3',
        price: 999,
        imgName: 'Album3.png',
      },
      {
        id: 4,
        name: 'Album 4',
        price: 1999,
        imgName: 'Album4.png',
      },
    ],
    merch: [
      {
        id: 5,
        name: 'T-Shirt',
        price: 1999,
        imgName: 'Shirt.png',
      },
      {
        id: 6,
        name: 'Coffee Cup',
        price: 699,
        imgName: 'Cofee.png',
      },
    ],
  };

  if (!Items) {
    return next(new ErrorResponse(`Items are not found, Server error...`, 500));
  }

  res.status(200).json({
    success: true,
    message: 'Data fetched successfully',
    data: Items,
  });
});

exports.pubKey = asyncHandler(
  ('/stripe-key',
  (req, res, next) => {
    res.status(200).json({ publishableKey: process.env.STRIPE_PUBLIC_KEY });
  })
);

const calculateAmount = () => {
  // Replace this constant with a calculation of the order's amount
  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};
