const express = require('express');

const {
    menuByTypeForUser,
    menuByTypeForStaff,
    editRecipeShop,
    getInfoShop,
    editInfoShop,
    detailRecipe,
    getListIngredient,
    importIngredient,
    exportIngredient,
    getListToppingByType,
    getShopInfo,
} = require('../controllers/shop.controllers');
const { checkExistIngredientShop } = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const { searchRecipe } = require('../controllers/recipe.controllers');

const shopRouter = express.Router();

shopRouter.get('/type', menuByTypeForUser);
shopRouter.get('/getListToppingByType', getListToppingByType);
shopRouter.get('/searchInShop', searchRecipe);
shopRouter.get('/typeForStaff', authenticate, authorize(1), menuByTypeForStaff);
shopRouter.get('/listIngredientShop', authenticate, authorize(1), getListIngredient);
shopRouter.get('/detailRecipe/:idRecipe', authenticate, authorize(1), detailRecipe);
shopRouter.put('/import/:idIngredient', authenticate, authorize(2), checkExistIngredientShop(), importIngredient);
shopRouter.put('/export/:idIngredient', authenticate, authorize(2), checkExistIngredientShop(), exportIngredient);
shopRouter.get('/getShopInfo', getShopInfo);
shopRouter.patch('/editInfo', authenticate, authorize(2), editInfoShop);
// shopRouter.put('/editRecipeShop/:idRecipe', authenticate, authorize(2), editRecipeShop);
module.exports = {
    shopRouter,
};
