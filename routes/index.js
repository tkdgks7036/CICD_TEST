const express = require('express');
const router = express.Router();

const postRouter = require('./post.js');
const signupRouter = require('./signup.js');
const loginRouter = require('./login.js');

router.use('/posts', postRouter);
router.use('/signup', signupRouter);
router.use('/login', loginRouter);

module.exports = router;