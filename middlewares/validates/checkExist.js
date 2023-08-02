const {
    Account,
    Product,
    Cart,
    Cart_product,
    Type,
    Invoice,
    Ingredient_shop,
    Shop,
    Ingredient,
    Recipe,
    User,
} = require('../../models');
const { QueryTypes, Op, where, STRING } = require('sequelize');
const createProduct = async (idProduct) => {
    let recipeList = idProduct.substring(1);
    recipeList = recipeList.split(','); // Tách các  idRecipe
    console.log(1);
    console.log(recipeList);
    let createdProducts = [];
    // Duyệt qua từng cặp idRecipe
    // console.log(recipeList);
    for (let i = 0; i < recipeList.length; i++) {
        const idRecipe = recipeList[i];

        const isMain = i === 0 ? 1 : 0; // Thiết lập id đầu là isMain

        // Tạo bản ghi trong bảng "product" với các giá trị tương ứng
        const createdProduct = await Product.create({
            idProduct: idProduct,
            idRecipe: idRecipe,
            isMain: isMain,
        });
        createdProducts.push(createdProduct);
    }
    return createdProducts;
};
const takeIngredient = async (idCart) => {
    let cartProducts = await Cart_product.findAll({
        where: { idCart },
        include: [
            {
                model: Product,
                required: false,
                where: { isMain: 1 },
                attributes: ['quantity'],
                include: [
                    {
                        model: Recipe,
                        attributes: ['name', 'image', 'price'],
                        include: [
                            {
                                model: Recipe_shop,
                                where: { idShop, isActive: 1 },
                                attributes: ['discount'],
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return cartProducts;
};
const checkExistAccount = () => {
    return async (req, res, next) => {
        try {
            //console.log(1)
            //const staff = req.staff
            const { username } = req.body;
            if (username === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistAcc1' });
            }
            if (username === undefined) {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistAcc2' });
            }

            const account = await Account.findOne({
                where: {
                    [Op.or]: [{ phone: username }, { mail: username }],
                },
            });

            if (!account) {
                return res.status(404).send({ isSuccess: false, mes: 'Tài khoản không tồn tại' });
            } else {
                req.account = account;
                next();
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'Có lỗi trong quá trình sửa tài khoản' });
        }
    };
};
const checkExistIngredient = () => {
    return async (req, res, next) => {
        try {
            const { idIngredient } = req.params;

            if (idIngredient === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistIngredient1' });
            }
            if (isNaN(idIngredient)) {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistIngredient2' });
            }

            const ingredient = await Ingredient.findOne({
                where: {
                    idIngredient,
                },
            });

            //console.log(created)
            if (!ingredient) {
                return res.status(404).send({ isSuccess: false, mes: 'Ingredient không tồn tại' });
            } else {
                req.ingredient = ingredient;
                next();
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'Có lỗi trong quá trình sửa ingredient' });
        }
    };
};
const checkExistTypeAndRecipe = () => {
    return async (req, res, next) => {
        try {
            const { idRecipe, idType } = req.body;

            if (idRecipe === '' || idType === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistTypeAndRecipe1' });
            }
            if (isNaN(idRecipe) || isNaN(idType)) {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistTypeAndRecipe2' });
            }

            const type = await Type.findOne({
                where: {
                    idType,
                },
            });
            const recipe = await Recipe.findOne({
                where: {
                    idRecipe,
                },
            });
            //console.log(created)
            if (!type) {
                return res.status(404).send({ isSuccess: false, mes: 'Type không tồn tại' });
            } else {
                if (recipe.idType == type.idType)
                    return res
                        .status(400)
                        .send({ isSuccess: false, mes: 'Không chọn recipe có type trùng với type chọn' });
                if (!recipe) return res.status(404).send({ isSuccess: false, mes: 'Recipe không tồn tại' });
                else {
                    req.type = type;
                    req.recipe = recipe;
                    next();
                }
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'Có lỗi trong quá trình checkExistRecipeAndType' });
        }
    };
};
const checkExistIngredientAndRecipe = () => {
    return async (req, res, next) => {
        try {
            const { idRecipe, idIngredient } = req.body;

            if (idIngredient === '' || idRecipe === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistIngredientAndRecipe1' });
            }
            if (isNaN(idIngredient) || isNaN(idRecipe)) {
                return res.status(400).json({ isSuccess: false, mes: 'checkExistIngredientAndRecipe2' });
            }

            const ingredient = await Ingredient.findOne({
                where: {
                    idIngredient,
                },
            });
            const recipe = await Recipe.findOne({
                where: {
                    idRecipe,
                },
            });
            //console.log(created)
            if (!ingredient) {
                return res.status(404).send({ isSuccess: false, mes: 'Ingredient không tồn tại' });
            } else {
                if (!recipe) return res.status(404).send({ isSuccess: false, mes: 'Recipe không tồn tại' });
                else {
                    req.ingredient = ingredient;
                    req.recipe = recipe;
                    next();
                }
            }
        } catch (error) {
            return res
                .status(500)
                .send({ isSuccess: false, mes: 'Có lỗi trong quá trình checkExistIngredientAndRecipe' });
        }
    };
};
const checkExistProduct = () => {
    return async (req, res, next) => {
        try {
            const { idRecipe, sizeProduct } = req.body;
            //console.log(idRecipe)
            if (idRecipe === '') {
                return res.status(400).json({ isSuccess: false });
            }
            //console.log('test')
            const listIdRecipe = idRecipe.split(',').map(Number);
            listIdRecipe.sort((a, b) => a - b);
            let idProduct = '';
            if (sizeProduct != 0) {
                idProduct += 'L';
            } else idProduct += 'M';

            for (let i = 0; i < listIdRecipe.length; i++) {
                idProduct += listIdRecipe[i] + ',';
            }

            // Loại bỏ dấu phẩy cuối cùng
            idProduct = idProduct.slice(0, -1);
            let listProduct = await Product.findAll({
                where: {
                    idProduct,
                },
            });
            if (listProduct.length !== 0) {
                //req.listProduct = listProduct
                req.idProduct = idProduct;
                next();
            } else {
                listProduct = await createProduct(idProduct);
                req.idProduct = idProduct;
                //console.log(listProduct)
                //return res.status(500).send({ isSuccess: false, isExist: false, status: true , listProduct});
                next();
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, isExist: false, status: true });
        }
    };
};
const checkExistCurrentCart = () => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            let [currentCart, created] = await Cart.findOrCreate({
                where: {
                    idUser: user.idUser,
                },
            });
            req.currentCart = currentCart;
            next();
        } catch (error) {
            return res.status(500).send({ isSuccess: false, isExist: false, mes: 'check' });
        }
    };
};
const checkExistProductCartAndDel = () => {
    return async (req, res, next) => {
        try {
            const { oldIdProduct } = req.params;
            const currentCart = req.currentCart;
            if (oldIdProduct == '') {
                return res.status(400).json({ isSuccess: false });
            }
            // const idProduct = req.idProduct;
            let cartProduct = await Cart_product.findOne({
                where: {
                    idProduct: oldIdProduct,
                    idCart: currentCart.idCart,
                },
            });
            if (cartProduct != null) {
                await cartProduct.destroy();
                next();
            } else next();

            //console.log('test1')
        } catch (error) {
            return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkAndDelProductCart' });
        }
    };
};
const checkExistInvoiceLessThan3 = () => {
    return async (req, res, next) => {
        try {
            //console.log('test1')

            const user = req.user;
            //console.log(user)
            const invoice = await Invoice.findOne({
                where: {
                    status: { [Op.lt]: 3, idUser: user.idUser },
                },
            });

            if (invoice == null) {
                next();
            } else {
                let idInvoice = invoice.idInvoice;
                return res.status(400).json({ isSuccess: false, mes: 'Đơn hàng hiên tại chưa hoàn thành', idInvoice });
            }

            //console.log('test1')
        } catch (error) {
            return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkInvoiceStatus0' });
        }
    };
};
const checkExistInvoiceStatus = (status) => {
    return async (req, res, next) => {
        try {
            const { idInvoice } = req.body;

            if (idInvoice === undefined) {
                return res.status(400).json({ isSuccess: false });
            }
            if (idInvoice === '') {
                return res.status(400).json({ isSuccess: false });
            }

            // const idProduct = req.idProduct;

            let invoice = await Invoice.findOne({
                where: {
                    idInvoice,
                    status: status,
                },
            });

            if (invoice != null) {
                req.invoice = invoice;
                req.status = status + 1;
                next();
            } else {
                return res
                    .status(400)
                    .json({ isSuccess: false, mes: ' idInvoice sai hoặc hoá đơn không còn ở trạng thái này' });
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkInvoiceStatus0' });
        }
    };
};
const checkExistIngredientShop = () => {
    return async (req, res, next) => {
        try {
            const staff = req.staff;
            const { idIngredient } = req.params;

            if (idIngredient === '') {
                return res.status(400).json({ isSuccess: false, mes: 'importIngredient1' });
            }
            if (isNaN(idIngredient)) {
                return res.status(400).json({ isSuccess: false, mes: 'importIngredient2' });
            }

            let [ingredient, created] = await Ingredient_shop.findOrCreate({
                where: {
                    idIngredient,
                    idShop: staff.idShop,
                },
            });
            let existIngrediet = await Ingredient.findOne({
                where: {
                    idIngredient,
                    isActive: 1,
                },
            });
            //console.log(created)
            if (!existIngrediet)
                return res.status(404).send({ isSuccess: false, created, mes: 'Không tồn tại ingredient' });
            if (ingredient != null) {
                req.ingredient = ingredient;
                next();
            } else {
                return res
                    .status(500)
                    .send({ isSuccess: false, created, mes: 'có lỗi trong quá trình tạo ingredientShop' });
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'có lỗi trong quá trình tạo ingredientShop' });
        }
    };
};
const checkNotExistAcount = () => {
    return async (req, res, next) => {
        try {
            //const staff = req.staff
            const { phone, mail } = req.body;

            if (phone === '' || mail === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistAcc1' });
            }
            if (isNaN(phone)) {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistAcc2' });
            }

            const account = await Account.findOne({
                where: {
                    [Op.or]: [{ phone: phone }, { mail: mail }],
                },
            });

            //console.log(created)
            if (account) {
                return res.status(409).send({ isSuccess: false, mes: 'Tài khoản đã tồn tại' });
            } else {
                next();
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'Có lỗi trong quá trình tạo tài khoản' });
        }
    };
};
const checkNotExistShopWithLatitudeAndLongitude = () => {
    return async (req, res, next) => {
        try {
            //console.log(1)
            //const staff = req.staff
            let { latitude, longitude } = req.body;
            latitude = latitude.replace(/\s/g, '');
            longitude = longitude.replace(/\s/g, '');

            if (latitude === '' || longitude === '') {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistShop1' });
            }
            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ isSuccess: false, mes: 'checkNotExistShop2' });
            }

            const shop = await Shop.findOne({
                where: {
                    latitude,
                    longitude,
                },
            });

            //console.log(created)
            if (shop) {
                return res.status(409).send({ isSuccess: false, mes: 'Shop đã tồn tại' });
            } else {
                next();
            }
        } catch (error) {
            return res.status(500).send({ isSuccess: false, mes: 'Có lỗi trong quá trình thêm Shop' });
        }
    };
};
module.exports = {
    checkExistAccount,
    checkExistProduct,
    checkExistCurrentCart,
    checkExistProductCartAndDel,
    checkExistInvoiceLessThan3,
    checkExistInvoiceStatus,
    checkExistIngredientShop,
    checkNotExistAcount,
    checkNotExistShopWithLatitudeAndLongitude,
    checkExistIngredient,
    checkExistIngredientAndRecipe,
    checkExistTypeAndRecipe,
};
