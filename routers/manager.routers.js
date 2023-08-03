const express = require('express');

const {
    getReportByDate,
    getListStaff,
    getDetailChangeIngredientShop,
    addStaff,
    getSixMonthInputAndOuput,
    editStaff,
    deleteStaff,
    editShop,
    editManager,
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
} = require('../controllers/manager.controllers');
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
const managerRouter = express.Router();

managerRouter.post('/addStaff', authenticate, authorize(2), checkNotExistAcount(), addStaff);
managerRouter.patch('/editStaff/:idStaff', authenticate, authorize(2), editStaff);
managerRouter.delete('/deleteStaff', authenticate, authorize(2), checkExistAccount(), deleteStaff);
managerRouter.get('/detailChangeIngredientShop/:date', authenticate, authorize(2), getDetailChangeIngredientShop);
managerRouter.get('/getDataForChart', authenticate, authorize(2), getSixMonthInputAndOuput);
managerRouter.get('/getListStaff', authenticate, authorize(2), getListStaff);

// managerRouter.post('/addManager', authenticate, authorize(3), checkNotExistAcount(), addManager);
managerRouter.patch('/editManager/:idStaff', authenticate, authorize(3), editManager);
// managerRouter.delete('/deleteManager', authenticate, authorize(3), checkExistAccount(), deleteManager);
managerRouter.get('/getListIngredient', authenticate, authorize(3), getListIngredient);
managerRouter.post('/addIngredient', authenticate, authorize(3), addIngredient);
managerRouter.patch(
    '/editIngredient/:idIngredient',
    authenticate,
    authorize(3),
    checkExistIngredient(),
    editIngredient,
);
managerRouter.get('/getListRecipe', authenticate, authorize(3), getListRecipeAdmin);
managerRouter.get('/getDetailRecipe/:idRecipe', authenticate, authorize(3), detailRecipeAdmin);
managerRouter.post('/addRecipe', authenticate, authorize(3), addRecipe);
managerRouter.patch('/editRecipe/:idRecipe', authenticate, authorize(3), editRecipe);
managerRouter.put(
    '/editRecipeIngredient',
    authenticate,
    authorize(3),
    checkExistIngredientAndRecipe(),
    editRecipeIngredient,
);
managerRouter.get('/getDataForChart/:idShop', authenticate, authorize(3), getSixMonthInputAndOuput);
managerRouter.patch('/editShop/:idShop', authenticate, authorize(3), editShop);
managerRouter.post('/addRecipeType', authenticate, authorize(3), checkExistTypeAndRecipe(), addRecipeType);
managerRouter.delete('/deleteRecipeType', authenticate, authorize(3), checkExistTypeAndRecipe(), deleteRecipeType);

module.exports = {
    managerRouter,
};
