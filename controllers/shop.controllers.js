const {
    Shop,
    Ingredient,
    Type,
    Recipe,
    Recipe_type,
    Recipe_ingredient,
    Invoice,
    Staff,
    Account,
    Import,
    Export,
} = require('../models');
const db = require('../models/index');
const { QueryTypes, Op, where, sequelize } = require('sequelize');
const geolib = require('geolib');
const moment = require('moment-timezone'); // require

const getIngredientByIdRecipe = async (idRecipe) => {
    let ingredients = await Recipe_ingredient.findAll({
        where: { idRecipe },
        include: [
            {
                model: Ingredient,
            },
        ],
        raw: true,
    });
    ingredients = ingredients.map((item) => {
        return {
            idIngredient: item['idIngredient'],
            name: item['Ingredient.name'],
            image: item['Ingredient.image'],
            quantity: item['quantity'],
            unitName: item['Ingredient.unitName'],
            remainingQuantity: item['Ingredient.quantity'],
        };
    });
    return ingredients;
};
const changeQuantityIngredientShopWithTransaction = async (ingredient, quantity, type = 1, date, price = 0, t) => {
    //console.log('test1')
    let isSuccess;
    let runOut = false;
    let infoChange;
    try {
        // console.log('test2')
        if (type == 1) {
            ingredient.quantity += quantity;

            await ingredient.save({ transaction: t });

            infoChange = await Import.create(
                {
                    idIngredient: ingredient.idIngredient,
                    date: date,
                    quantity: quantity,
                    price: price,
                },
                { transaction: t },
            );
        } else {
            //console.log('test')
            ingredient.quantity -= quantity;
            //console.log('test')
            //console.log(ingredient)

            await ingredient.save({ transaction: t });

            infoChange = await Export.create(
                {
                    idIngredient: ingredient.idIngredient,
                    date: date,
                    quantity: quantity,
                    info: price,
                },
                { transaction: t },
            );
        }
        //console.log('test3')
        if (ingredient.quantity < 0) {
            isSuccess = false;
            runOut = true;
            await setRecipeOffActive(ingredient.idIngredient);
            await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
        }

        isSuccess = true;
    } catch (error) {
        isSuccess = false;
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
        //console.error('Transaction rolled back:', error);
    }

    return { isSuccess, runOut, infoChange };
};
const menuByTypeForStaff = async (req, res) => {
    try {
        const staff = req.user;
        let listType = [];
        let menu;
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe.findAll({
                where: { idType: { [Op.in]: listType } },
            });
        } else {
            menu = await Recipe.findAll({});
        }
        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const detailRecipe = async (req, res) => {
    try {
        const staff = req.user;
        const { idRecipe } = req.params;

        if (idRecipe === '' || isNaN(idRecipe)) {
            return res.status(400).json({ isSuccess: false, message: 'detailRecipe' });
        }

        let recipe = await Recipe.findOne({
            where: { idRecipe },
            raw: true,
        });
        let ingredients = await getIngredientByIdRecipe(idRecipe);
        //console.log(1)
        //console.log(recipe['Recipe_shops.isActive'])

        recipe.ingredients = ingredients;

        return res.status(200).json({ isSuccess: true, recipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra  lỗi getDetailRecipe' });
    }
};
const editRecipeShop = async (req, res) => {
    try {
        const staff = req.user;
        const { idRecipe } = req.params;
        const { isActive, discount } = req.body;
        if (isActive === undefined || discount === undefined || idRecipe === '') {
            return res.status(400).json({ isSuccess: false, message: 'editRecipeShop' });
        }
        if (isActive === '' || discount === '') {
            return res.status(400).json({ isSuccess: false, message: 'editRecipeShop' });
        }
        //console.log(typeof(parseInt(isActive)))
        let recipe;
        if (parseInt(discount) < 0 || parseInt(discount) > 100)
            return res.status(400).json({ isSuccess: false, message: 'editRecipeShop' });
        if (isActive == 1 || isActive == 0) {
            recipe = await Recipe_shop.findOne({
                where: {
                    idRecipe,
                },
                include: [
                    {
                        model: Recipe,
                        required: true,
                    },
                ],
            });
            if (!recipe) return res.status(404).send({ isSuccess: false, message: 'Recipe không tồn tại' });
            recipe.isActive = isActive;
            recipe.discount = discount;
            await recipe.save();
        } else return res.status(400).json({ isSuccess: false, message: 'editRecipeShop' });

        return res.status(200).json({ isSuccess: true, recipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi, editRecipeShop' });
    }
};
const menuByTypeForUser = async (req, res) => {
    try {
        let listType = [];
        let menu;
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe.findAll({
                where: {
                    idType: { [Op.in]: listType },
                },
                // attributes: ['discount'],
                // include: [
                //     {
                //         model: Recipe,
                //         where: { idType: { [Op.in]: listType } },
                //     },
                // ],
            });
        } else {
            menu = await Recipe.findAll({
                where: {
                    isActive: 1,
                },
                // attributes: ['discount'],
                // include: [
                //     {
                //         model: Recipe,
                //     },
                // ],
            });
        }

        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const getInfoShop = async (req, res) => {
    try {
        const staff = req.user;

        const shop = await Shop.findOne({
            attributes: ['address', 'image', 'isActive'],
        });

        return res.status(200).json({ isSuccess: true, shop });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const getListIngredient = async (req, res) => {
    try {
        const staff = req.user;

        let ingredients = await Ingredient.findAll({
            raw: true,
        });

        return res.status(200).json({ isSuccess: true, ingredients });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const editInfoShop = async (req, res) => {
    try {
        const staff = req.user;
        const { isActive, image, address, latitude, longitude } = req.body;

        const shop = await Shop.findOne({});
        shop.isActive = Number(isActive) ? Number(isActive) : shop.isActive;
        shop.image = image ? image : shop.image;
        shop.address = address ? address : shop.address;
        shop.latitude = latitude ? latitude : shop.latitude;
        shop.longitude = longitude ? longitude : shop.longitude;
        await shop.save();

        return res.status(200).json({ isSuccess: true, shop });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const importIngredient = async (req, res) => {
    try {
        const t = await db.sequelize.transaction(); // Bắt đầu transaction
        const staff = req.user;
        const ingredient = req.ingredient;
        const { price, quantity } = req.body;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        if (price === '' || quantity === '') {
            return res.status(400).json({ isSuccess: false, message: 'importIngredient1' });
        }
        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ isSuccess: false, message: 'importIngredient2' });
        }
        console.log('test');

        if (Number(quantity) <= 0)
            return res.status(400).json({ isSuccess: false, message: 'Số lượng phải lớn hơn 0' });
        console.log('test2');
        let { isSuccess, infoChange } = await changeQuantityIngredientShopWithTransaction(
            ingredient,
            Number(quantity),
            1,
            date,
            price,
            t,
        );
        await t.commit();
        return res.status(200).json({ isSuccess, ingredient, infoChange });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi tại importIngredient' });
    }
};
const setRecipeOffActive = async (idIngredient) => {
    const recipeId = await Recipe_ingredient.findAll({
        where: { idIngredient: idIngredient },
        raw: true,
    });
    await Recipe.update(
        { isActive: 0 },
        {
            where: { idRecipe: { [Op.in]: recipeId.map((item) => item.idRecipe) } },
        },
    );
};
const exportIngredient = async (req, res) => {
    try {
        const t = await db.sequelize.transaction(); // Bắt đầu transaction
        const staff = req.user;
        const ingredient = req.ingredient;
        const { info, quantity } = req.body;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        if (info === '' || quantity === '') {
            return res.status(400).json({ isSuccess: false, message: 'exportIngredient1' });
        }
        if (info === undefined || isNaN(quantity)) {
            return res.status(400).json({ isSuccess: false, message: 'exportIngredient2' });
        }

        if (Number(quantity) <= 0)
            return res.status(400).json({ isSuccess: false, message: 'Số lượng phải lớn hơn 0' });
        let { isSuccess, infoChange } = await changeQuantityIngredientShopWithTransaction(
            ingredient,
            Number(quantity),
            0,
            date,
            info,
            t,
        );
        await setRecipeOffActive(ingredient.idIngredient);
        t.commit();
        if (!isSuccess) return res.status(500).json({ error: 'Đã xảy ra lỗi tại exportIngredient' });

        return res.status(200).json({ isSuccess, ingredient, infoChange });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi tại exportIngredient' });
    }
};
const getListToppingByType = async (req, res) => {
    try {
        let listType = await Type.findAll({
            include: {
                model: Recipe_type,
                include: [
                    {
                        model: Recipe,
                        // attributes: ['name', 'info', 'price', 'image'],
                    },
                ],
            },
            //raw:true,
        });
        listType.forEach((type) => {
            type.Recipe_types.forEach((recipe) => {
                recipe.dataValues.name = recipe.Recipe.dataValues.name;
                recipe.dataValues.info = recipe.Recipe.dataValues.info;
                recipe.dataValues.price = recipe.Recipe.dataValues.price;
                recipe.dataValues.image = recipe.Recipe.dataValues.image;
                recipe.dataValues.isActive = recipe.Recipe.dataValues.isActive;
                recipe.dataValues.discount = recipe.Recipe.dataValues.discount;
                delete recipe.dataValues.idType;
                delete recipe.Recipe.dataValues;
            });
            type.dataValues.listToppings = type.dataValues.Recipe_types;
            delete type.dataValues.Recipe_types;
        });
        return res.status(200).json({ isSuccess: true, listType });
    } catch (error) {
        res.status(500).json({ error: 'getListRecipeAdmin' });
    }
};
const getShopInfo = async (req, res) => {
    try {
        const currentLocation = {
            latitude: parseFloat(req.query.latitude),
            longitude: parseFloat(req.query.longitude),
        };
        // const listStoreNearest = getNearestDistances(currentLocation, listShop, 2);
        const shop = await Shop.findOne({
            attributes: ['address', 'image', 'isActive', 'latitude', 'longitude'],
            raw: true,
        });
        const distance = geolib.getDistance(currentLocation, { latitude: shop.latitude, longitude: shop.longitude });
        if (!shop) {
            return res.status(500).json({ error: 'Không tìm thấy cửa hàng' });
        }
        //const nearestDistances = getNearestDistances(currentLocation, coordinateList);

        return res.status(200).json({
            isSuccess: true,
            shop,
            distance,
        });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    menuByTypeForUser,
    menuByTypeForStaff,
    editRecipeShop,
    getInfoShop,
    editInfoShop,
    detailRecipe,
    getListIngredient,
    importIngredient,
    exportIngredient,
    getIngredientByIdRecipe,
    changeQuantityIngredientShopWithTransaction,
    getListToppingByType,
    getShopInfo,
};
