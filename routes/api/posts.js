const express = require('express');
const passport = require('passport');

// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load validation
const validatePostInput = require('../../validation/post');

const router = express.Router();

// -------------------------------------------
// @route   GET api/posts
// @desc    Get all posts
// @access  Public
// -------------------------------------------
router.get('/', (req, res) => {
  Post
    .find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(() => res.status(400).send({ nopostsfound: 'No posts found' }));
});

// -------------------------------------------
// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
// -------------------------------------------
router.get('/:id', (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => res.json(post))
    .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
});

// -------------------------------------------
// @route   POST api/posts
// @desc    Create post
// @access  Private
// -------------------------------------------
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.status(400).send({ name: 'DB error', error: err }));
  },
);

// -------------------------------------------
// @route   DELETE api/posts:id
// @desc    Delete post
// @access  Private
// -------------------------------------------
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post
      .findById(req.params.id)
      .then((post) => {
        // Check for owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }
        // Delete
        return post
          .remove()
          .then(() => res.json({ success: true }));
      })
      .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
  },
);

// -------------------------------------------
// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
// -------------------------------------------
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post
      .findById(req.params.id)
      .then((post) => {
        if (post.likes.find(like => like.user.toString() === req.user.id)) {
          return res.status(400).json({ alreadyliked: 'User already liked this post' });
        }
        // Add user id to array
        // eslint-disable-next-line
        post.likes = [...post.likes, { user: req.user.id }];
        post
          .save()
          .then(updatedPost => res.json(updatedPost))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
  },
);

// -------------------------------------------
// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
// -------------------------------------------
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post
      .findById(req.params.id)
      .then((post) => {
        if (!post.likes.find(like => like.user.toString() === req.user.id)) {
          return res.status(400).json({ notliked: 'User has not liked this post yet' });
        }
        // Remove user id from array
        // eslint-disable-next-line
        post.likes = post.likes
          .filter(like => like.user.toString() !== req.user.id);

        post
          .save()
          .then(updatedPost => res.json(updatedPost))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
  },
);

// -------------------------------------------
// @route   POST api/posts/comment/:id
// @desc    Add comment on post
// @access  Private
// -------------------------------------------
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post
      .findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // Add to comments array
        // eslint-disable-next-line
        post.comments = [newComment, ...post.comments];

        post
          .save()
          .then(updatedPost => res.json(updatedPost))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
  },
);

// -------------------------------------------
// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
// @todo    Implement checking for comment owner
// -------------------------------------------
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post
      .findById(req.params.id)
      .then((post) => {
        // Check if the comment exists
        if (!post.comments.find(comment => comment.id.toString() === req.params.comment_id)) {
          return res.status(404).json({ comment: 'Comment does not exist' });
        }

        // Remove comment from array
        // eslint-disable-next-line
        post.comments = post.comments
          .filter(comment => comment.id.toString() !== req.params.comment_id);

        post
          .save()
          .then(updatedPost => res.json(updatedPost))
          .catch(err => res.status(400).send({ name: 'DB error', error: err }));
      })
      .catch(() => res.status(404).send({ nopostfound: `No post found with the ID: ${req.params.id}` }));
  },
);

module.exports = router;
