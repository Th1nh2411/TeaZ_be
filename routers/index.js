const express = require('express');
const { userRouter } = require('./user.routers');
const { accountRouter } = require('./account.routers');
const { shopRouter } = require('./shop.routers');
const { orderRouter } = require('./order.routers');
const { adminRouter } = require('./admin.routers');
const { uploadRouter } = require('./upload.routers');

const rootRouter = express.Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/account', accountRouter);
rootRouter.use('/shop', shopRouter);
rootRouter.use('/order', orderRouter);
rootRouter.use('/admin', adminRouter);
rootRouter.use('/upload', uploadRouter);
module.exports = {
    rootRouter,
};
