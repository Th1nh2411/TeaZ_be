const express = require("express");
const { userRouter } = require("./user.routers");
const { accountRouter } = require("./account.routers");
const {shopRouter} = require("./shop.routers")
const {recipeRouter} = require("./recipe.routers")
const {orderRouter} = require("./order.routers")
const {managerRouter} = require("./manager.routers")
const {adminRouter} = require("./admin.routers")

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/account", accountRouter);
rootRouter.use("/shop", shopRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/recipe", recipeRouter);
rootRouter.use("/manager", managerRouter);
rootRouter.use("/admin", adminRouter);
module.exports = {
    rootRouter,
}
