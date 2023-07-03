const express = require("express");

const { getReportByDate, getListStaff, getDetailChangeIngredientShop, addStaff, getSixMonthInputAndOuput, editStaff, deleteStaff }
    = require("../controllers/manager.controllers");
    const { checkNotExistAcount, checkExistAccount } = require("../middlewares/validates/checkExist");
const { authorize } = require("../middlewares/auth/authorize.js")
const { authenticate } = require("../middlewares/auth/authenticate.js")
const managerRouter = express.Router();

managerRouter.get("/reportByDate/:date", authenticate, authorize(2), getReportByDate);
managerRouter.post("/addStaff", authenticate, authorize(2), checkNotExistAcount(), addStaff)
managerRouter.patch("/editStaff/:idStaff", authenticate, authorize(2), editStaff)
managerRouter.delete("/deleteStaff", authenticate, authorize(2), checkExistAccount(), deleteStaff)
managerRouter.get("/detailChangeIngredientShop/:date", authenticate, authorize(2), getDetailChangeIngredientShop);
managerRouter.get("/getDataForChart", authenticate, authorize(2), getSixMonthInputAndOuput)
managerRouter.get("/getListStaff", authenticate, authorize(2), getListStaff)

module.exports = {
    managerRouter,
}