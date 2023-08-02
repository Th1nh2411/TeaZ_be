const { raw, text } = require('body-parser');
const db = require('../models/index');
const {
    Shop,
    Recipe_shop,
    Recipe,
    Recipe_type,
    Cart,
    Cart_product,
    Product,
    Shipping_company,
    Invoice,
    Recipe_ingredient,
    Ingredient_shop,
    Ingredient,
} = require('../models');
const { QueryTypes, Op, where, STRING } = require('sequelize');
const { getIngredientByIdRecipe, changeQuantityIngredientShopWithTransaction } = require('./shop.controllers');
const moment = require('moment-timezone'); // require

const changeIngredientByIdRecipe = async (idRecipe, quantity, type, date, idInvoice) => {
    let infoChange1 = [];
    //console.log(1)
    let ingredients = await getIngredientByIdRecipe(idRecipe);
    async function processIngredientsRecursive(index) {
        if (index >= ingredients.length) {
            return; // Kết thúc đệ quy khi đã xử lý hết tất cả các phần tử
        }

        const item = ingredients[index];
        let idIngredient = Number(item['idIngredient']);
        let ingredient = await Ingredient.findOne({
            where: {
                idIngredient,
            },
        });
        let quantityIngredient = Number(item['quantity']) * quantity;
        let price;
        if (type == 1) {
            price = 0;
        } else {
            price = 'BH' + idInvoice + '-' + idRecipe + '-' + idIngredient;
        }
        let results = await changeQuantityIngredientShopWithTransaction(
            ingredient,
            Number(quantityIngredient),
            type,
            date,
            price,
        );

        // Gọi đệ quy để xử lý vòng lặp tiếp theo
        await processIngredientsRecursive(index + 1);
    }

    await processIngredientsRecursive(0);

    //let {isSuccess, infoChange} = await changeQuantityIngredientShopWithTransaction(ingredient, Number(quantity), 1, date, price)
    return infoChange1;
};
const changeIngredientByInvoice = async (invoice, type, date) => {
    let infoChange = [];
    //let quantity = 0
    let cart = await Cart.findAll({
        where: {
            idUser: invoice.idUser,
        },
        raw: true,
        include: [
            {
                model: Cart_product,
                include: [
                    {
                        model: Product,
                        include: [
                            {
                                model: Recipe,
                            },
                        ],
                    },
                ],
            },
        ],
    });

    for (const item of cart) {
        let idRecipe = Number(item['Cart_products.Product.Recipe.idRecipe']);
        let quantity = Number(item['Cart_products.quantity']);
        let info = await changeIngredientByIdRecipe(idRecipe, quantity, type, date, invoice.idInvoice);
        infoChange.push(...info);
    }

    return infoChange;
};
const getToppingOfProductOfInvoice = async (idProduct) => {
    let listTopping = await Product.findAll({
        where: {
            idProduct: idProduct,
        },
        attributes: ['idRecipe', 'quantity', 'isMain'],
        include: [
            {
                model: Recipe,
                attributes: ['name', 'image'],
            },
        ],
        raw: true,
    });

    listTopping = listTopping.filter((item) => {
        if (item['isMain'] == 1) {
            return false;
        }

        return true; // Giữ lại phần tử trong danh sách
    });

    listTopping = listTopping.map((item) => {
        return {
            idRecipe: item['idRecipe'],
            name: item['Recipe.name'],
            quantity: item['quantity'],
            isMain: item['isMain'],
            image: item['Recipe.image'],
        };
    });
    //console.log('test1')
    //console.log(listTopping)
    return listTopping;
};

const getToppingOfProduct = async (idProduct) => {
    //console.log('test')
    let listTopping = await Product.findAll({
        where: {
            idProduct: idProduct,
            isMain: 0,
        },
        attributes: ['idRecipe'],
        include: [
            {
                model: Recipe,
                where: { isActive: 1 },
                attributes: ['price', 'name', 'image', 'discount'],
                //required:true,
            },
        ],
        raw: true,
    });
    //console.log(listTopping)
    let toppingCost = 0;
    //console.log(listTopping)

    let shouldEditList = false;
    listTopping = listTopping.filter((item) => {
        if (item['Recipe.discount'] == null) {
            shouldEditList = true;
            return false; // Xóa phần tử khỏi danh sách
        } else {
            let totalItem = item['Recipe.price'] * (item['Recipe.discount'] / 100);
            toppingCost += totalItem;
            return true; // Giữ lại phần tử trong danh sách
        }
    });
    let edit = 'false';
    if (shouldEditList == true) {
        listTopping = [];

        edit = 'true';
    }

    listTopping = listTopping.map((item) => {
        return {
            idRecipe: item['idRecipe'],
            name: item['Recipe.name'],
            isMain: item['isMain'],
            price: item['Recipe.price'],
            discount: item['Recipe.discount'],
        };
    });

    return { listTopping, toppingCost, edit };
};
const getDetailCart = async (idCart) => {
    let cart = await Cart.findAll({
        where: {
            idCart,
        },

        include: [
            {
                model: Cart_product,
                attributes: ['idProduct', 'size', 'quantity'],
                required: false,
                include: [
                    {
                        model: Product,
                        required: false,
                        where: { isMain: 1 },
                        attributes: ['quantity'],
                        include: [
                            {
                                model: Recipe,
                                attributes: ['idRecipe', 'name', 'image', 'price'],
                            },
                        ],
                    },
                ],
            },
        ],
        raw: true,
        //nest:true,
    });

    const promises = cart.map(async (item) => {
        let listTopping = await getToppingOfProductOfInvoice(item['Cart_products.idProduct']);

        return {
            idCart: item['idCart'],
            name: item['Cart_products.Product.Recipe.name'],
            idProduct: item['Cart_products.idProduct'],
            size: item['Cart_products.size'],
            quantityProduct: item['Cart_products.quantity'],
            image: item['Cart_products.Product.Recipe.image'],
            price: item['Cart_products.Product.Recipe.price'],
            idRecipe: item['Cart_products.Product.Recipe.idRecipe'],

            listTopping,
        };
    });

    cart = await Promise.all(promises);
    cart = cart.filter((item) => {
        if (item['name'] == null) {
            if (item['idProduct'] == null) {
                return false;
            }

            return false;
        }

        return true;
    });

    return cart;
};

const getCurrentCartAndTotal = async (user) => {
    let cart = await Cart.findAll({
        where: {
            idUser: user.idUser,
        },

        include: [
            {
                model: Cart_product,
                attributes: ['idProduct', 'size', 'quantity'],
                required: false,
                include: [
                    {
                        model: Product,
                        required: false,
                        where: { isMain: 1 },
                        include: [
                            {
                                model: Recipe,
                                where: { isActive: 1 },
                                attributes: ['name', 'image', 'price', 'discount'],
                            },
                        ],
                    },
                ],
            },
        ],
        raw: true,
    });
    let total = 0;

    const promises = cart.map(async (item) => {
        let { listTopping, toppingCost, edit } = await getToppingOfProduct(item['Cart_products.idProduct']);
        const mainCost =
            item['Cart_products.Product.Recipe.price'] * (item['Cart_products.Product.Recipe.discount'] / 100);
        const totalProducts = (toppingCost + mainCost + item['Cart_products.size']) * item['Cart_products.quantity'];
        total += totalProducts;
        if (edit == 'true') {
            return {
                idCart: item['idCart'],
                name: null,
                idProduct: item['Cart_products.idProduct'],
                size: item['Cart_products.size'],
                quantityProduct: item['Cart_products.quantity'],
                image: item['Cart_products.Product.Recipe.image'],
                price: item['Cart_products.Product.Recipe.price'],
                discount: item['Cart_products.Product.Recipe.discount'],
                listTopping,
                totalProducts,
            };
        }

        return {
            idCart: item['idCart'],
            name: item['Cart_products.Product.Recipe.name'],
            idProduct: item['Cart_products.idProduct'],
            size: item['Cart_products.size'],
            quantityProduct: item['Cart_products.quantity'],
            image: item['Cart_products.Product.Recipe.image'],
            price: item['Cart_products.Product.Recipe.price'],
            discount: item['Cart_products.Product.Recipe.discount'],
            listTopping,
            totalProducts,
        };
    });

    cart = await Promise.all(promises);
    cart = cart.filter((item) => {
        if (item['name'] == null) {
            if (item['idProduct'] == null) {
                return false;
            }

            return false;
        }
        //if(item['listTopping']=='edit') return false
        return true;
    });
    //mess =  Array.from(new Set(mess))
    return { cart, total };
};
const getToppingOptions = async (req, res) => {
    try {
        const idRecipe = Number(req.query.idRecipe);

        const detailRecipe = await Recipe.findOne({
            where: { idRecipe },
            attributes: ['idType'],
        });
        console.log(detailRecipe);
        if (detailRecipe == '') {
            return res.status(404).json({ error: 'Không tim thấy thông tin sản phẩm' });
        }
        //console.log(detailRecipe.idType)
        let listTopping = await Recipe_type.findAll({
            where: { idType: detailRecipe.idType },
            //attributes: [['name', 'Recipe.name']],
            attributes: ['idRecipe'],
            required: true,
            include: [
                {
                    model: Recipe,
                    // attributes: ['name', 'price', 'image'],
                    required: true,
                },
            ],
            raw: true,
        });
        console.log(listTopping);
        listTopping = listTopping.map((item) => {
            return {
                idRecipe: item['idRecipe'],
                name: item['Recipe.name'],
                discount: item['Recipe.discount'],
                isActive: item['Recipe.isActive'],
                price: item['Recipe.price'],
                image: item['Recipe.image'],
            };
        });
        //console.log(listTopping)

        return res.status(200).json({ isSuccess: true, listTopping });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const addToCart = async (req, res) => {
    try {
        const idProduct = req.idProduct;
        const { quantityProduct, sizeProduct } = req.body;
        const currentCart = req.currentCart;

        if (quantityProduct === '') {
            return res.status(400).json({ isSuccess: false });
        }
        console.log('test1');
        let cartProduct = await Cart_product.findOne({
            where: {
                idProduct: idProduct,
                idCart: currentCart.idCart,
                size: Number(sizeProduct),
            },
        });
        console.log('test2');
        //console.log(cartProduct)
        if (cartProduct !== null) {
            cartProduct.quantity += Number(quantityProduct);

            await cartProduct.save();
        } else {
            cartProduct = await Cart_product.create({
                idProduct: idProduct,
                idCart: currentCart.idCart,
                size: Number(sizeProduct),
                quantity: quantityProduct,
            });
        }

        return res.status(200).json({ isSuccess: true, cartProduct });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const delAllItemCart = async (req, res) => {
    try {
        //console.log('test')
        //const idProduct = req.idProduct;
        const currentCart = req.currentCart;

        console.log(currentCart.idCart);
        await Cart_product.destroy({
            where: {
                idCart: currentCart.idCart,
            },
        });
        console.log(2);

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const confirmDeleteProductCart = async (req, res) => {
    try {
        //const idProduct = req.idProduct;

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getDetailInvoice = async (req, res) => {
    try {
        //const idProduct = req.idProduct;
        const { idInvoice } = req.params;
        const user = req.user;
        //console.log(idInvoice)
        if (idInvoice === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (idInvoice === '') {
            return res.status(400).json({ isSuccess: false });
        }
        console.log(user);
        let invoice = await Invoice.findOne({
            where: { idInvoice },
            include: [
                {
                    model: Cart,
                    required: true,
                    where: { idUser: user.idUser },
                    attributes: ['idCart'],
                },
            ],
        });
        console.log('test');
        if (invoice == null) {
            return res.status(400).json({ error: 'invoice không tồn tại hoặc không thuộc user đang đăng nhập' });
        }
        let cart = await getDetailCart(invoice.Cart.idCart);

        return res.status(200).json({ isSuccess: true, invoice, cart });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const changeStatusInvoice = async (req, res) => {
    try {
        //const idProduct = req.idProduct;
        const status = req.status;
        let invoice = req.invoice;

        invoice.status = status;
        await invoice.save();

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const confirmInvoice = async (req, res) => {
    try {
        //const idProduct = req.idProduct;
        const { total } = req.body;
        if (total === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (total === '') {
            return res.status(400).json({ isSuccess: false });
        }
        let invoice = req.invoice;

        if (invoice.total != total) return res.status(400).json({ isSuccess: false, mes: 'total sai' });
        invoice.status = 1;
        await invoice.save();

        return res.status(200).json({ isSuccess: true, invoice });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getCurrentCart = async (req, res) => {
    try {
        const user = req.user;

        let { cart, total } = await getCurrentCartAndTotal(user);
        //console.log(listTopping)

        return res.status(200).json({ isSuccess: true, cart, total });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getShipFee = async (req, res) => {
    try {
        //const user = req.user;

        const distance = Number(req.query.distance);
        const idShipping_company = Number(req.query.idShipping_company);
        const shipping_company = await Shipping_company.findOne({
            where: { idShipping_company },
            raw: true,
        });
        console.log(shipping_company);
        let total = (distance / 1000) * shipping_company.costPerKm;

        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, total });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getListCompanies = async (req, res) => {
    try {
        //const user = req.user;

        const shipping_company = await Shipping_company.findAll({});

        //console.log(listTopping)
        return res.status(200).json({ isSuccess: true, shipping_company });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const cancelInvoice = async (req, res) => {
    try {
        const user = req.user;

        const invoice = await Invoice.findOne({
            where: { status: { [Op.lt]: 3 } },
            include: [
                {
                    model: Cart,
                    required: true,
                    where: { idUser: user.idUser },
                    attributes: ['idCart'],
                },
            ],
        });

        if (invoice.status == 0) {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            let infoChange = await changeIngredientByInvoice(invoice, 1, date);
            await invoice.destroy();
            return res
                .status(200)
                .json({ isSuccess: true, isCancel: true, mes: 'Đã huỷ thành công hoá đơn chưa thanh toán' });
        } else {
            return res
                .status(200)
                .json({ isSuccess: true, isCancel: false, mes: 'Chưa xử lý trường hợp huỷ hoá đã thanh toán' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getCurrentInvoice = async (req, res) => {
    try {
        const user = req.user;
        const invoice = await Invoice.findOne({
            where: { status: { [Op.lt]: 3, idUser: user.idUser } },
        });
        if (invoice == null) {
            return res.status(200).json({ isSuccess: true, invoice });
        }
        let cart = await getDetailCart(invoice.idCart);
        //delete invoice.dataValues.Cart
        return res.status(200).json({ isSuccess: true, invoice, cart });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getAllInvoiceUser = async (req, res) => {
    try {
        const user = req.user;

        const invoices = await Invoice.findAll({
            where: { idUser: user.idUser },
        });

        return res.status(200).json({ isSuccess: true, invoices });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const createInvoice = async (req, res) => {
    try {
        let isSuccess;
        const { idShipping_company, shippingFee } = req.body;
        if (idShipping_company === undefined || shippingFee === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (idShipping_company === '' || shippingFee === '') {
            return res.status(400).json({ isSuccess: false });
        }
        //console.log(idShipping_company)
        const user = req.user;
        const currentCart = req.currentCart;
        let { cart, total } = await getCurrentCartAndTotal(user);

        let idInvoice;

        const t = await db.sequelize.transaction(); // Bắt đầu transaction\
        try {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');

            let invoice = await Invoice.create(
                {
                    idUser: user.idUser,
                    idShipping_company,
                    shippingFee,
                    total,
                    date,
                    status: 0,
                },
                { transaction: t },
            );
            console.log(1);
            idInvoice = invoice.idInvoice;
            // currentCart.isCurrent = 0;
            let infoChange = await changeIngredientByInvoice(invoice, 0, date, { transaction: t });
            await currentCart.destroy({ transaction: t });
            console.log(currentCart);
            //await invoice.destroy()

            await t.commit(); // Lưu thay đổi và kết thúc transaction
            isSuccess = true;
        } catch (error) {
            isSuccess = false;
            await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction7
        }

        //console.log(listTopping)
        return res.status(200).json({ isSuccess, idInvoice, cart });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const testInvoice = async (req, res) => {
    try {
        const { idShipping_company, shippingFee } = req.body;
        if (idShipping_company === undefined || shippingFee === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (idShipping_company === '' || shippingFee === '') {
            return res.status(400).json({ isSuccess: false });
        }
        //console.log(idShipping_company)
        const user = req.user;
        const currentCart = req.currentCart;
        let { cart, total, mess } = await getCurrentCartAndTotal(user);

        const t = await db.sequelize.transaction(); // Bắt đầu transaction\
        try {
            // console.log('test2')
            let invoice = await Invoice.create(
                {
                    idCart: currentCart.idCart,
                    idShipping_company,
                    shippingFee,
                    total,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    status: 0,
                },
                { transaction: t },
            );

            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            const idInvoice = invoice.idInvoice;
            currentCart.isCurrent = 0;
            let infoChange = await changeIngredientByInvoice(invoice, 0, date, { transaction: t });
            //await currentCart.save()
            //await invoice.destroy()

            await t.commit(); // Lưu thay đổi và kết thúc transaction
            isSuccess = true;
        } catch (error) {
            isSuccess = false;
            await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction7
        }

        //console.log(listTopping)
        return res.status(200).json({ isSuccess, cart });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getAllOrderInTransit = async (req, res) => {
    try {
        const staff = req.staff;

        let invoices = await Invoice.findAll({
            where: {
                status: 2,
            },
            attributes: ['idInvoice', 'date', 'idCart'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let detail = await getDetailCart(item['idCart']);
            //console.log(cart)
            return {
                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,
            };
        });

        invoices = await Promise.all(promises);
        console.log('test2');

        return res.status(200).json({ isSuccess: true, invoices });
    } catch (error) {
        res.status(500).json(error);
    }
};
const getAllInvoiceByDate = async (req, res) => {
    try {
        const staff = req.staff;
        const { date } = req.params;
        if (date === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (date === '') {
            return res.status(400).json({ isSuccess: false });
        }
        const startDate = moment(date).startOf('day').toDate();
        const endDate = moment(date).endOf('day').toDate();
        let invoices = await Invoice.findAll({
            where: {
                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                },
                status: {
                    [Op.ne]: 0,
                },
            },
            attributes: ['idInvoice', 'total', 'date', 'status', 'idCart'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let detail = await getDetailCart(item['idCart']);
            //console.log(cart)
            return {
                idInvoices: item['idInvoice'],
                total: item['total'],
                date: item['date'],

                detail,
            };
        });

        invoices = await Promise.all(promises);
        //console.log('test2')

        return res.status(200).json({ isSuccess: true, invoices });
    } catch (error) {
        res.status(500).json(error);
    }
};
const getAllOrder = async (req, res) => {
    try {
        const staff = req.staff;

        let invoices = await Invoice.findAll({
            where: {
                status: 1,
            },
            attributes: ['idInvoice', 'date', 'idCart'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let detail = await getDetailCart(item['idCart']);
            //console.log(cart)
            return {
                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,
            };
        });

        invoices = await Promise.all(promises);

        return res.status(200).json({ isSuccess: true, invoices });
    } catch (error) {
        res.status(500).json(error);
    }
};
const searchRecipe = async (req, res) => {
    try {
        if (req.query.name === '' || req.query.limit === '') {
            return res.status(400).json({ isSuccess: false, mes: 'searchRecipe1' });
        }

        if (isNaN(req.query.limit) || req.query.name === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'searchRecipe2' });
        }

        const name = req.query.name;
        const limit = Number(req.query.limit);

        let recipes = await Recipe.findAll({
            where: {
                name: { [Op.like]: `%${name}%` },
            },
            attributes: ['idRecipe', 'name', 'image', 'price', 'discount'],
            limit: limit,
            raw: true,
            // include: [
            //     {
            //         model: Recipe_shop,
            //         where: { isActive: 1 },
            //         required: true,
            //         attributes: ['discount'],
            //     },
            // ],
        });
        console.log(recipes);
        // recipes = recipes.map((item) => {
        //     return {
        //         idRecipe: item['idRecipe'],
        //         name: item['name'],
        //         image: item['image'],
        //         price: item['price'],
        //         discount: item['discount'],
        //     };
        // });

        res.status(200).json({
            recipes,
            isSuccess: true,
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    getToppingOptions,
    delAllItemCart,
    addToCart,
    getCurrentCart,
    getShipFee,
    getListCompanies,
    createInvoice,
    confirmDeleteProductCart,
    confirmInvoice,
    getCurrentInvoice,
    getAllInvoiceUser,
    getDetailInvoice,
    cancelInvoice,
    getAllOrder,
    changeStatusInvoice,
    getAllOrderInTransit,
    getAllInvoiceByDate,
    getDetailCart,
    searchRecipe,
    testInvoice,
    changeIngredientByInvoice,
};
