const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model')
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();



router.get('/', (req, res, next) => {
  Users.get()
    .then(users => {
      res.json(users);
    })
    .catch(next);
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  Users.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
    .then(() => {
      return Users.getById(req.params.id)
        .then(updatedUser => {
          res.json(updatedUser)
        })
        .catch(next)
    })
});

router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
    .then(() => {
      return Users.getById(req.params.id)
        .then(() => {
          res.json(req.user)
        })
    })
    .catch(next)
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await Users.getUserPosts(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
);

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Posts.insert({
      user_id: req.params.id,
      text: req.text
    });
    res.status(201).json(result);
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Barrrd Aim inside posts router happened",
    message: err.message,
    stack: err.stack
  })
})
// do not forget to export the router
module.exports = router;