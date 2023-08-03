const express = require('express');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const { getUserInfo, editUserInfo } = require('../controllers/user.controllers.js');
const { authorize } = require('../middlewares/auth/authorize.js');
const userRouter = express.Router();

// userRouter.get("/history/:date",authenticate, getHistory);

// userRouter.get("/menu/:date",authenticate, getRecipeHistory)

userRouter.get('/getUserInfo', authenticate, authorize(0), getUserInfo);
userRouter.patch('/editUserInfo', authenticate, authorize(0), editUserInfo);
module.exports = {
    userRouter,
};
