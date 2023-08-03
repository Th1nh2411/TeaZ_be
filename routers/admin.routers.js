const express = require('express');

const {
    getListManager,
    getSixMonthInputAndOutput,
    getListShop,
    editShop,
    addShop,
    editManager,
    deleteManager,
    getSixMonthInputAndOutputAllShop,
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
    checkNotExistAccount,
    checkExistAccount,
    checkNotExistShopWithLatitudeAndLongitude,
    checkExistIngredient,
    checkExistIngredientAndRecipe,
    checkExistTypeAndRecipe,
} = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const {
    getReportByDate,
    getListStaff,
    addStaff,
    editStaff,
    deleteStaff,
    getDetailChangeIngredientShop,
} = require('../controllers/manager.controllers');
const adminRouter = express.Router();

// adminRouter.post("/addManager", authenticate, authorize(3), checkNotExistAccount(), addManager)
adminRouter.get('/reportByDate/:date', authenticate, authorize(2), getReportByDate);
adminRouter.get('/getListStaff', authenticate, authorize(2), getListStaff);
adminRouter.post('/addStaff', authenticate, authorize(2), checkNotExistAccount(), addStaff);
adminRouter.patch('/editStaff/:idUser', authenticate, authorize(2), editStaff);
adminRouter.delete('/deleteStaff', authenticate, authorize(2), checkExistAccount(), deleteStaff);

adminRouter.get('/getDataForChart', authenticate, authorize(2), getSixMonthInputAndOutput);
adminRouter.get('/detailChangeIngredientShop/:date', authenticate, authorize(2), getDetailChangeIngredientShop);
adminRouter.post('/addIngredient', authenticate, authorize(2), addIngredient);
adminRouter.patch('/editIngredient/:idIngredient', authenticate, authorize(2), checkExistIngredient(), editIngredient);
adminRouter.post('/addRecipe', authenticate, authorize(2), addRecipe);
adminRouter.patch('/editRecipe/:idRecipe', authenticate, authorize(2), editRecipe);
adminRouter.put(
    '/editRecipeIngredient',
    authenticate,
    authorize(2),
    checkExistIngredientAndRecipe(),
    editRecipeIngredient,
);

adminRouter.get('/getListIngredient', authenticate, authorize(2), getListIngredient);

adminRouter.get('/getListRecipe', authenticate, authorize(2), getListRecipeAdmin);
adminRouter.get('/getDetailRecipe/:idRecipe', authenticate, authorize(2), detailRecipeAdmin);

adminRouter.get('/getAllDataForChart', authenticate, authorize(2), getSixMonthInputAndOutputAllShop);
adminRouter.get('/getListManager', authenticate, authorize(2), getListManager);
adminRouter.get('/getListShop', authenticate, authorize(2), getListShop);
adminRouter.post('/addShop', authenticate, authorize(2), checkNotExistShopWithLatitudeAndLongitude(), addShop);

module.exports = {
    adminRouter,
};
