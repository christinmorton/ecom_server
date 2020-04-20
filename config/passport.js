const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const asyncHandler = require('../app/middleware/async');
const User = require('../app/models/User');

let user;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      asyncHandler(async (email, password, done) => {
        // Match user
        user = await User.findOne({ email }).select('+password');

        if (!user) {
          return done(null, false, { message: 'Invalid Credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid Credentials' });
        }

        if (isMatch) {
          return done(null, user);
        }
      })
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
