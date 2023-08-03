const express = require('express');

const {
    getListManager,
    getSixMonthInputAndOuput,
    getListShop,
    editShop,
    addShop,
    editManager,
    deleteManager,
    getSixMonthInputAndOuputAllShop,
    getListIngredient,
    addIngredient,
    editIngredient,
    getListRecipeAdmin,
    detailRecipeAdmin,
    addRecipe,
    editRecipe,
    editRecipeIngredient,
    addRecipeType,
    deleteRecipeType,
} = require('../controllers/admin.controllers');
const {
    checkNotExistAcount,
    checkExistAccount,
    checkNotExistShopWithLatitudeAndLongitude,
    checkExistIngredient,
    checkExistIngredientAndRecipe,
    checkExistTypeAndRecipe,
} = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const { getReportByDate } = require('../controllers/manager.controllers');
const adminRouter = express.Router();

// adminRouter.post("/addManager", authenticate, authorize(3), checkNotExistAcount(), addManager)
adminRouter.patch('/editRecipe/:idRecipe', authenticate, authorize(2), editRecipe);
adminRouter.get('/reportByDate/:date', authenticate, authorize(2), getReportByDate);
adminRouter.patch('/editManager/:idStaff', authenticate, authorize(2), editManager);
adminRouter.delete('/deleteManager', authenticate, authorize(2), checkExistAccount(), deleteManager);
adminRouter.get('/getListIngredient', authenticate, authorize(2), getListIngredient);
adminRouter.post('/addIngredient', authenticate, authorize(2), addIngredient);
adminRouter.patch('/editIngredient/:idIngredient', authenticate, authorize(2), checkExistIngredient(), editIngredient);
adminRouter.get('/getListRecipe', authenticate, authorize(2), getListRecipeAdmin);
adminRouter.get('/getDetailRecipe/:idRecipe', authenticate, authorize(2), detailRecipeAdmin);
adminRouter.post('/addRecipe', authenticate, authorize(2), addRecipe);
adminRouter.put(
    '/editRecipeIngredient',
    authenticate,
    authorize(2),
    checkExistIngredientAndRecipe(),
    editRecipeIngredient,
);
adminRouter.get('/getDataForChart/:idShop', authenticate, authorize(2), getSixMonthInputAndOuput);
adminRouter.get('/getAllDataForChart', authenticate, authorize(2), getSixMonthInputAndOuputAllShop);
adminRouter.get('/getListManager', authenticate, authorize(2), getListManager);
adminRouter.get('/getListShop', authenticate, authorize(2), getListShop);
adminRouter.post('/addShop', authenticate, authorize(2), checkNotExistShopWithLatitudeAndLongitude(), addShop);
adminRouter.patch('/editShop/:idShop', authenticate, authorize(2), editShop);
adminRouter.post('/addRecipeType', authenticate, authorize(2), checkExistTypeAndRecipe(), addRecipeType);
adminRouter.delete('/deleteRecipeType', authenticate, authorize(2), checkExistTypeAndRecipe(), deleteRecipeType);

module.exports = {
    adminRouter,
};
