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
const adminRouter = express.Router();

// adminRouter.post("/addManager", authenticate, authorize(3), checkNotExistAcount(), addManager)
adminRouter.patch('/editManager/:idStaff', authenticate, authorize(3), editManager);
adminRouter.delete('/deleteManager', authenticate, authorize(3), checkExistAccount(), deleteManager);
adminRouter.get('/getListIngredient', authenticate, authorize(3), getListIngredient);
adminRouter.post('/addIngredient', authenticate, authorize(3), addIngredient);
adminRouter.patch('/editIngredient/:idIngredient', authenticate, authorize(3), checkExistIngredient(), editIngredient);
adminRouter.get('/getListRecipe', authenticate, authorize(3), getListRecipeAdmin);
adminRouter.get('/getDetailRecipe/:idRecipe', authenticate, authorize(3), detailRecipeAdmin);
adminRouter.post('/addRecipe', authenticate, authorize(3), addRecipe);
adminRouter.patch('/editRecipe/:idRecipe', authenticate, authorize(3), editRecipe);
adminRouter.put(
    '/editRecipeIngredient',
    authenticate,
    authorize(3),
    checkExistIngredientAndRecipe(),
    editRecipeIngredient,
);
adminRouter.get('/getDataForChart/:idShop', authenticate, authorize(3), getSixMonthInputAndOuput);
adminRouter.get('/getAllDataForChart', authenticate, authorize(3), getSixMonthInputAndOuputAllShop);
adminRouter.get('/getListManager', authenticate, authorize(3), getListManager);
adminRouter.get('/getListShop', authenticate, authorize(3), getListShop);
adminRouter.post('/addShop', authenticate, authorize(3), checkNotExistShopWithLatitudeAndLongitude(), addShop);
adminRouter.patch('/editShop/:idShop', authenticate, authorize(3), editShop);
adminRouter.post('/addRecipeType', authenticate, authorize(3), checkExistTypeAndRecipe(), addRecipeType);
adminRouter.delete('/deleteRecipeType', authenticate, authorize(3), checkExistTypeAndRecipe(), deleteRecipeType);

module.exports = {
    adminRouter,
};
