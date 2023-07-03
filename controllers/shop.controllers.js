const { Shop, Recipe_shop, Recipe, Ingredient, Recipe_ingredient, Ingredient_shop, Import, Export } = require("../models");
const db = require("../models/index");
const { QueryTypes, Op, where, sequelize } = require("sequelize");
const moment = require('moment-timezone'); // require
const { raw } = require("body-parser");

const getIngredientByIdRecipe = async (idRecipe, idShop) => {

    let ingredients = await Recipe_ingredient.findAll({
        where: { idRecipe },
        include: [{
            model: Ingredient,
            include: [
                {
                    model: Ingredient_shop,
                    where: { idShop },
                    required: false,
                }
            ]
        }],
        raw: true,
    })
    ingredients = ingredients.map(item => {

        return {
            idIngredient: item['idIngredient'],
            name: item['Ingredient.name'],
            image: item['Ingredient.image'],
            quantity: item['quantity'],
            unitName: item['Ingredient.unitName'],
            remainingQuantity: item['Ingredient.Ingredient_shops.quantity'],
        }
    });
    return ingredients
}
const changeQuantityIngredientShopWithTransaction = async (ingredient, quantity, type =1, date, price=0) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction
    //console.log('testn')
    let isSuccess
    let infoChange
    try {
       // console.log('test2')
        if(type==1){
            ingredient.quantity+=quantity
            
            await ingredient.save({ transaction: t });
            infoChange = await Import.create({ 
                idIngredient:ingredient.idIngredient,
                idShop:ingredient.idShop,
                date:date,
                quantity:quantity,
                price:price,
            }, { transaction: t });
        }
        else{
            //console.log('test')
            ingredient.quantity-=quantity
            //console.log('test')
            //console.log(ingredient)
            await ingredient.save({ transaction: t });
            infoChange = await Export.create({ 
                idIngredient:ingredient.idIngredient,
                idShop:ingredient.idShop,
                date:date,
                quantity:quantity,
                info:price
            }, { transaction: t });
        }
        //console.log('test3')
        if(ingredient.quantity<0) {
            isSuccess= false
            await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
        }
        
        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess= true
    } catch (error) {
        isSuccess= false
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
        //console.error('Transaction rolled back:', error);
    }

    return {isSuccess, infoChange}
}
const menuByTypeForStaff = async (req, res) => {
    try {

        const staff = req.staff
        let listType = []
        let menu
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: staff.idShop,

                },
                attributes: ['discount', 'isActive'],
                include: [{
                    model: Recipe,
                    where: { idType: { [Op.in]: listType }, isDel:0 },
                }
                ]
            })
        }
        else {
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: staff.idShop,

                },
                attributes: ['discount', 'isActive'],
                include: [{
                    model: Recipe,
                    where:{isDel:0}
                }
                ]
            })
        }
        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const detailRecipe = async (req, res) => {
    try {

        const staff = req.staff
        const { idRecipe } = req.params
        //console.log(staff.idShop)

        if (idRecipe === '' || isNaN(idRecipe)) {
            return res.status(400).json({ isSuccess: false, mes: 'detailRecipe' });
        }

        let recipe = await Recipe.findOne({
            where: { idRecipe },
            include: [{
                model: Recipe_shop,
                where: { idShop: staff.idShop },
                attributes: ['isActive', 'discount']
            }],
            raw: true,
        })
        let ingredients = await getIngredientByIdRecipe(idRecipe, staff.idShop)
        //console.log(1)
        //console.log(recipe['Recipe_shops.isActive'])
        recipe.isActive = recipe['Recipe_shops.isActive']
        recipe.discount = recipe['Recipe_shops.discount']
        recipe.ingredients = ingredients
        delete recipe['Recipe_shops.isActive']
        delete recipe['Recipe_shops.discount']


        return res.status(200).json({ isSuccess: true, recipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra  lỗi getDetailRecipe' });
    }
};
const editRecipeShop = async (req, res) => {
    try {
        const staff = req.staff
        const { idRecipe } = req.params
        const { isActive, discount } = req.body;
        if (isActive === undefined || discount === undefined || idRecipe === '') {
            return res.status(400).json({ isSuccess: false, mes: 'editRecipeShop' });
        }
        if (isActive === '' || discount === '') {
            return res.status(400).json({ isSuccess: false, mes: 'editRecipeShop' });
        }
        //console.log(typeof(parseInt(isActive)))
        let recipe
        if (parseInt(discount) < 0 || parseInt(discount) > 100) return res.status(400).json({ isSuccess: false, mes: 'editRecipeShop' });
        if (isActive == 1 || isActive == 0) {
            recipe = await Recipe_shop.findOne({
                where: {
                    idRecipe

                },
                include:[
                    {
                        model:Recipe,
                        where:{isDel:0},
                        required:true
                    }
                ]
            })
            if(!recipe) return res.status(404).send({ isSuccess: false, mes: 'Recipe không tồn tại' });;
            recipe.isActive = isActive
            recipe.discount = discount
            await recipe.save()
        }
        else return res.status(400).json({ isSuccess: false, mes: 'editRecipeShop' });

        return res.status(200).json({ isSuccess: true, recipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi, editRecipeShop' });
    }
};
const menuByTypeForUser = async (req, res) => {
    try {
        if (req.query.idShop == '') {
            return res.status(400).json({ isSuccess: true });
        }
        const idShop = parseInt(req.query.idShop);
        let listType = []
        let menu
        if (req.query.idType !== '') {
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: idShop,
                    isActive: 1,
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,
                    where: { idType: { [Op.in]: listType },isDel:0 },
                }
                ]
            })
        }
        else {
            menu = await Recipe_shop.findAll({
                where: {
                    idShop: idShop,
                    isActive: 1,
                },
                attributes: ['discount'],
                include: [{
                    model: Recipe,
                    where: {isDel:0}
                }
                ]
            })
        }





        return res.status(200).json({ isSuccess: true, menu });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const getInfoShop = async (req, res) => {
    try {

        const staff = req.staff

        const shop = await Shop.findOne({
            where: { idShop: staff.idShop },
            attributes: ['address', 'image', 'isActive'],
        })




        return res.status(200).json({ isSuccess: true, shop });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const getListIngredientShop = async (req, res) => {
    try {

        const staff = req.staff

        let ingredients = await Ingredient_shop.findAll({
            where: { idShop: staff.idShop },
            include: [{
                model: Ingredient,
                where:{isDel:0}
            }],
            raw: true,
        })

        ingredients = ingredients.map(item => {

            return {
                idIngredient: item['idIngredient'],
                name: item['Ingredient.name'],
                image: item['Ingredient.image'],
                quantity: item['quantity'],
                unitName: item['Ingredient.unitName'],

            }
        })



        return res.status(200).json({ isSuccess: true, ingredients });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const editInfoShop = async (req, res) => {
    try {
        const staff = req.staff
        const { isActive, image } = req.body;

        if (isActive === undefined || image === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (isActive === '' || image === '') {
            return res.status(400).json({ isSuccess: false });
        }
        let shop
        if (Number(isActive) == 1 || Number(isActive) == 0) {
            shop = await Shop.findOne({
                where: { idShop: staff.idShop },
                //attributes: ['address','image','isActive'],
            })

            shop.isActive = Number(isActive)
            shop.image = image

            await shop.save()
        }
        else return res.status(400).json({ isSuccess: false });




        return res.status(200).json({ isSuccess: true, shop });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi tại editInfo' });
    }
};
const importIngredient = async (req, res) => {
    try {
        const staff = req.staff
        const ingredient = req.ingredient
        const { price, quantity } = req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss")
        if (price === '' || quantity === '') {
            return res.status(400).json({ isSuccess: false, mes: 'importIngredient1' });
        }
        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ isSuccess: false, mes: 'importIngredient2' });
        }

        if (Number(quantity) <= 0) return res.status(400).json({ isSuccess: false, mes: 'Số lượng phải lớn hơn 0' });
        console.log('test')
        let {isSuccess, infoChange} = await changeQuantityIngredientShopWithTransaction(ingredient, Number(quantity), 1, date, price)




        return res.status(200).json({ isSuccess, ingredient,  infoChange });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi tại importIngredient' });
    }
};
const exportIngredient = async (req, res) => {
    try {
        const staff = req.staff
        const ingredient = req.ingredient
        const { info , quantity } = req.body;
        const date = moment().format("YYYY-MM-DD HH:mm:ss")
        if (info === '' || quantity === '') {
            return res.status(400).json({ isSuccess: false, mes: 'exportIngredient1' });
        }
        if (info === undefined || isNaN(quantity)) {
            return res.status(400).json({ isSuccess: false, mes: 'exportIngredient2' });
        }

        if (Number(quantity) <= 0) return res.status(400).json({ isSuccess: false, mes: 'Số lượng phải lớn hơn 0' });
        console.log('test')
        let {isSuccess, infoChange} = await changeQuantityIngredientShopWithTransaction(ingredient, Number(quantity), 0, date, info)
        if(!isSuccess) return res.status(500).json({ error: 'Đã xảy ra lỗi tại exportIngredient' });



        return res.status(200).json({ isSuccess, ingredient, infoChange });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi tại exportIngredient' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    menuByTypeForUser, menuByTypeForStaff, editRecipeShop, getInfoShop, editInfoShop, detailRecipe,
    getListIngredientShop, importIngredient, exportIngredient, getIngredientByIdRecipe, changeQuantityIngredientShopWithTransaction
};