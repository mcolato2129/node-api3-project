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

//MM NOTES

//All the heavy lifting of the code is done in my MW file to make this part of the code very easy. It is all plug in & use but the Order you plug in the MW COUNTS ON HOW IT WILL RUN. THE PATHING IS IMPORTANT HERE and I need to know what it is I want MY MW to do before i write it and implement it into my routes.

//Lines 1-8, 23, & 100 are very Important and key things to use. MY MW means nothing if I am not importing with require() & getting the correct files.

//express.Router() gives my routes the access of all the stuff i can do with express. i.e.-- route.get, .post, .delete etc.

//line 100 is crucial because my server will have no clue what is going on with my endpoints and thee functionality if I am not exporting to where my server is actually starting.

//MY NOTES
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