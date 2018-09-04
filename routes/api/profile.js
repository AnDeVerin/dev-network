const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile'); // Load Profile model
const User = require('../../models/User'); // Load user model

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const router = express.Router();

// -------------------------------------------
// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
// -------------------------------------------
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// -------------------------------------------
// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
// -------------------------------------------
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  },
);

// -------------------------------------------
// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
// -------------------------------------------
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    }).catch(err => res.status(404).json(err));
});

// -------------------------------------------
// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
// -------------------------------------------
router.get('/user/:user_id', (req, res) => {
  const errors = {
    noprofile: 'There is no profile for this user',
  };

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    }).catch(() => res.status(404).json(errors));
});

// -------------------------------------------
// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
// -------------------------------------------
router.get('/all', (req, res) => {
  const errors = {
    noprofile: 'There are no profiles',
  };
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        res.status(404).json(errors);
      } else {
        res.json(profiles);
      }
    }).catch(() => res.status(404).json(errors));
});

// -------------------------------------------
// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
// -------------------------------------------
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = { user: req.user.id };
    const {
      handle, company, website, location, bio, status, githubusername,
      skills, youtube, twitter, facebook, linkedin, instagram,
    } = req.body;

    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - split into array
    if (typeof skills !== 'undefined') {
      profileFields.skills = skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        ).then(updatedProfile => res.json(updatedProfile));
      } else {
        // Create
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then((foundProfile) => {
          if (foundProfile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          } else {
            // Save profile
            new Profile(profileFields).save().then(savedProfile => res.json(savedProfile));
          }
        });
      }
    });
  },
);

// -------------------------------------------
// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
// -------------------------------------------
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const {
          title, company, location, from, to, current, description,
        } = req.body;
        const newExp = {
          title, company, location, from, to, current, description,
        };

        // Add to exp array
        profile.experience = [newExp, ...profile.experience]; // eslint-disable-line
        profile
          .save()
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(error => res.status(404).send(error));
  },
);

// -------------------------------------------
// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
// -------------------------------------------
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const {
          school, degree, fieldofstudy, from, to, current, description,
        } = req.body;
        const newEdu = {
          school, degree, fieldofstudy, from, to, current, description,
        };

        // Add to education array
        profile.education = [newEdu, ...profile.education]; // eslint-disable-line
        profile
          .save()
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(error => res.status(404).send(error));
  },
);

// -------------------------------------------
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
// -------------------------------------------
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Remove experience item
        // eslint-disable-next-line
        profile.experience = profile.experience
          .filter(item => item.id !== req.params.exp_id);
        // Save
        profile
          .save()
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(error => res.status(404).send(error));
  },
);

// -------------------------------------------
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
// -------------------------------------------
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Remove experience item
        // eslint-disable-next-line
        profile.education = profile.education
          .filter(item => item.id !== req.params.edu_id);
        // Save
        profile
          .save()
          .then(updatedProfile => res.json(updatedProfile))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(error => res.status(404).send(error));
  },
);

// -------------------------------------------
// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
// -------------------------------------------
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => User.findOneAndRemove({ _id: req.user.id }))
      .then(() => res.json({ success: true }))
      .catch(error => res.status(404).send(error));
  },
);

module.exports = router;
