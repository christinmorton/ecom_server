const path = require('path');
const colors = require('colors');
const passport = require('passport');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Create user, handle register user
// @route     POST /users/register
// @access    public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let user;

  if (!password || !password2) {
    return next(new ErrorResponse('Please provide a valid password', 400));
  }

  if (password !== password2) {
    return next(new ErrorResponse('Please make sure the passwords match', 400));
  }

  // Check if user exist
  user = await User.findOne({ email });
  if (user) {
    return next(
      new ErrorResponse(
        'User already exist. Please register a new account.',
        401
      )
    );
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
  });

  res.status(200).json({
    success: true,
    data: 'User was created successfully',
  });
});

// @desc      Login user, handle login user
// @route     POST /users/login
// @access    public
exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);

  res.status(200).json({
    success: true,
    data: 'User has logged in successfully',
  });
});

// @desc      Log user out
// @route     GET /users/logout
// @access    Private/User
exports.logout = asyncHandler(async (req, res, next) => {
  req.logout();

  res.status(200).json({
    success: true,
    data: 'User has logged in successfully',
  });
});
