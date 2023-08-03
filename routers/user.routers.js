const express = require('express');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const { getShopInfo } = require('../controllers/user.controllers');

const userRouter = express.Router();

userRouter.get('/getListShop', getShopInfo);

// userRouter.get("/history/:date",authenticate, getHistory);

// userRouter.get("/menu/:date",authenticate, getRecipeHistory)

// userRouter.get("/info/:date",authenticate, getInfo)
module.exports = {
    userRouter,
};
