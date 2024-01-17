const User = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  );

  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'user not found' })
    } else {
      req.user = user; //this saves this data as a key value pair into the req to be used later. More Notes on this below
      next();
    }
  } catch {
    res.status(500).json({ message: 'User is bad' });
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ message: 'missing required name field' })
  } else {
    req.name = name; //This is Important!!! I can store the data inside a key of req because req is an object and can be called inother files onces my MW is exported CORRECTLY.
    next()
  }
} // All this middle ware function does is check for 'name' to see if it is there are not. This MW Func looks super simple but it is powerful because now I do not Have to keep checking if there is a name or no name in the router file for my codes. Keeps evrything dry. We love that.

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    req.text = text
    next()
  }
}

// do not forget to expose these functions to other modules
//IMPORTANT LINE. My Custom MW WILL BE USELESS TO MY ROUTES WITHOUT IT BEING EXPORTED 
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}