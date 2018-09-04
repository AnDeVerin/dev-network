const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User'); // Load user model
const keys = require('../../config/keys'); // Load secret

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const router = express.Router();

// -------------------------------------------
// @route   GET api/users/test
// @desc    Test users route
// @access  Public
// -------------------------------------------
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// -------------------------------------------
// @route   GET api/users/register
// @desc    Register user
// @access  Public
// -------------------------------------------
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //  Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
      s: '200', // size
      r: 'pg', // rating
      d: 'mm', // default pic
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;

      bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
        if (hashErr) throw hashErr;

        newUser.password = hash;
        newUser
          .save()
          .then(resUser => res.json(resUser))
          .catch(resErr => console.log(resErr));
      });
    });
  });
});

// -------------------------------------------
// @route   GET api/users/login
// @desc    Login user / Return JWT token
// @access  Public
// -------------------------------------------
router.post('/login', (req, res) => {
  //  Check validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };
        //  Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: keys.expiresIn },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`,
            });
          },
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// -------------------------------------------
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
// -------------------------------------------
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  },
);

module.exports = router;
