const db = require('../models/index');
const {
    Recipe,
    Recipe_type,
    Cart_product,
    Product,
    Shipping_company,
    Invoice,
    Recipe_ingredient,
    Invoice_product,
    Ingredient,
    Shop,
} = require('../models');
const { QueryTypes, Op, where, STRING } = require('sequelize');
const { getIngredientByIdRecipe, changeQuantityIngredientShopWithTransaction } = require('./shop.controllers');
const moment = require('moment-timezone'); // require

const changeIngredientByIdRecipe = async (idRecipe, quantity, type, date, idInvoice, t) => {
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
            t,
        );
        // Gọi đệ quy để xử lý vòng lặp tiếp theo
        await processIngredientsRecursive(index + 1);
    }

    await processIngredientsRecursive(0);

    //let {isSuccess, infoChange} = await changeQuantityIngredientShopWithTransaction(ingredient, Number(quantity), 1, date, price)
    return infoChange1;
};
const changeIngredientByCart = async (invoice, type, date) => {
    let infoChange = [];
    //let quantity = 0
    const t = await db.sequelize.transaction(); // Bắt đầu transaction
    let cartProducts = await Cart_product.findAll({
        where: {
            idUser: invoice.idUser,
        },
        include: [
            {
                model: Product,
            },
        ],
        raw: true,
    });
    for (const item of cartProducts) {
        let idRecipe = Number(item['Product.idRecipe']);
        let quantity = Number(item['quantity']);
        console.log(idRecipe);
        let info = await changeIngredientByIdRecipe(idRecipe, quantity, type, date, invoice.idInvoice, t);
        infoChange.push(...info);
    }
    await t.commit(); // Lưu thay đổi và kết thúc transaction

    return infoChange;
};
const changeIngredientByInvoice = async (invoice, type, date) => {
    let infoChange = [];
    //let quantity = 0
    console.log(invoice);
    let invoiceProducts = await Invoice_product.findAll({
        where: {
            idInvoice: invoice.idInvoice,
        },
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
        raw: true,
    });

    for (const item of invoiceProducts) {
        let idRecipe = Number(item['Product.Recipe.idRecipe']);
        let quantity = Number(item['quantity']);
        let info = await changeIngredientByIdRecipe(idRecipe, quantity, type, date, invoice.idInvoice);
        infoChange.push(...info);
    }

    return infoChange;
};

const getToppingProduct = async (idProduct) => {
    let listTopping = await Product.findAll({
        where: {
            idProduct: idProduct,
            isMain: 0,
        },
        include: [
            {
                model: Recipe,
            },
        ],
        raw: true,
    });
    let toppingCost = 0;

    listTopping = listTopping.map((item) => {
        let totalItem = item['Recipe.price'] * (item['Recipe.discount'] / 100);
        toppingCost += totalItem;
        return {
            idRecipe: item['Recipe.idRecipe'],
            name: item['Recipe.name'],
            image: item['Recipe.image'],
            price: item['Recipe.price'],
        };
    });
    //console.log('test1')
    return { listTopping, toppingCost };
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
const getInvoiceProduct = async (idInvoice) => {
    let products = await Invoice_product.findAll({
        where: {
            idInvoice,
        },
        include: [
            {
                model: Product,
                required: false,
                where: { isMain: 1 },
                include: [
                    {
                        model: Recipe,
                        attributes: ['idRecipe', 'name', 'image', 'price'],
                    },
                ],
            },
        ],
        raw: true,
        //nest:true,
    });
    const promises = products.map(async (item) => {
        let { listTopping, toppingCost } = await getToppingProduct(item['idProduct']);

        return {
            // idCart: item['idCart'],
            name: item['Product.Recipe.name'],
            idProduct: item['idProduct'],
            size: item['size'],
            quantity: item['quantity'],
            image: item['Product.Recipe.image'],
            idRecipe: item['Product.Recipe.idRecipe'],
            listTopping,
            totalProduct: item['totalProduct'],
        };
    });

    products = await Promise.all(promises);
    products = products.filter((item) => {
        if (item['name'] == null) {
            if (item['idProduct'] == null) {
                return false;
            }

            return false;
        }

        return true;
    });

    return products;
};

const getCurrentCartAndTotal = async (idUser) => {
    let products = await Cart_product.findAll({
        attributes: ['idProduct', 'size', 'quantity'],
        where: {
            idUser: idUser,
        },
        required: false,
        include: [
            {
                model: Product,
                required: false,
                where: { isMain: 1 },
                include: [
                    {
                        model: Recipe,
                        // where: { isActive: 1 },
                        attributes: ['name', 'image', 'price', 'discount', 'isActive'],
                    },
                ],
            },
        ],

        raw: true,
    });
    let total = 0;
    const promises = products.map(async (item) => {
        let { listTopping, toppingCost } = await getToppingProduct(item['idProduct']);
        const mainCost = item['Product.Recipe.price'] * (item['Product.Recipe.discount'] / 100);
        const totalProduct = (toppingCost + mainCost + item['size']) * item['quantity'];
        total += totalProduct;
        return {
            idUser: item['idUser'],
            name: item['Product.Recipe.name'],
            idProduct: item['idProduct'],
            size: item['size'],
            quantity: item['quantity'],
            image: item['Product.Recipe.image'],
            price: item['Product.Recipe.price'],
            isActive: item['Product.Recipe.isActive'],
            discount: item['Product.Recipe.discount'],
            listTopping,
            totalProduct,
        };
    });

    products = await Promise.all(promises);

    return { products, total };
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
        const user = req.user;

        if (quantityProduct === '') {
            return res.status(400).json({ isSuccess: false });
        }
        console.log('test1');
        let cartProduct = await Cart_product.findOne({
            where: {
                idProduct: idProduct,
                idUser: user.idUser,
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
                idUser: user.idUser,
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
        const user = req.user;

        await Cart_product.destroy({
            where: {
                idUser: user.idUser,
            },
        });

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
        let invoice = await Invoice.findOne({
            where: { idInvoice },
        });
        if (invoice == null) {
            return res.status(400).json({ error: 'invoice không tồn tại hoặc không thuộc user đang đăng nhập' });
        }
        let products = await getInvoiceProduct(idInvoice);

        return res.status(200).json({ isSuccess: true, invoice, products });
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

        let invoice = req.invoice;

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
        const shop = await Shop.findOne({ raw: true });
        let { products, total } = await getCurrentCartAndTotal(user.idUser);

        return res.status(200).json({ isSuccess: true, products, total, shopStatus: shop.isActive });
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
            where: { status: { [Op.lt]: 3 }, idUser: user.idUser },
        });
        if (invoice.status < 2) {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(1);
            let infoChange = await changeIngredientByInvoice(invoice, 1, date);
            console.log(2);
            await Invoice_product.destroy({
                where: { idInvoice: invoice.idInvoice },
            });
            await invoice.destroy();
            if (invoice.status == 0) {
                return res.status(200).json({ isSuccess: true, isCancel: true, message: 'Đã huỷ thành công hoá đơn' });
            } else {
                return res.status(200).json({
                    isSuccess: true,
                    isCancel: true,
                    message: 'Đã huỷ thành công hoá đơn. Hệ thống sẽ hoàn tiền cho quý khách trong vòng 24h',
                });
            }
        } else {
            return res
                .status(200)
                .json({ isSuccess: true, isCancel: false, message: 'Đơn đang được giao. Không thể huỷ hoá đơn' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getCurrentInvoice = async (req, res) => {
    try {
        const user = req.user;
        const invoice = await Invoice.findOne({
            where: { status: { [Op.lt]: 3 } },
            idUser: user.idUser,
        });
        if (invoice == null) {
            return res.status(200).json({ isSuccess: true, invoice });
        }
        let products = await getInvoiceProduct(invoice.idInvoice);

        return res.status(200).json({ isSuccess: true, invoice, products });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const getAllInvoiceUser = async (req, res) => {
    try {
        const user = req.user;

        const invoices = await Invoice.findAll({
            where: { idUser: user.idUser },
            order: [['date', 'DESC']],
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
        const cartProduct = await Cart_product.findOne({
            where: {
                idUser: user.idUser,
            },
        });
        if (!cartProduct) {
            return res.status(400).json({ isSuccess: false, hasProduct: false });
        }
        let { products, total } = await getCurrentCartAndTotal(user.idUser);

        let invoice;

        const t = await db.sequelize.transaction(); // Bắt đầu transaction\
        try {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');

            invoice = await Invoice.create(
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

            let idInvoice = invoice.idInvoice;
            products.forEach(async (product, index) => {
                await Invoice_product.create(
                    {
                        idInvoice: idInvoice,
                        idProduct: product.idProduct,
                        size: product.size,
                        quantity: product.quantity,
                        totalProduct: product.totalProduct,
                    },
                    { transaction: t },
                );
            });
            console.log(1);
            let infoChange = await changeIngredientByCart(invoice, 0, date, { transaction: t });
            console.log(2);
            await Cart_product.destroy({ where: { idUser: user.idUser }, transaction: t });

            await t.commit(); // Lưu thay đổi và kết thúc transaction
            isSuccess = true;
        } catch (error) {
            isSuccess = false;
            await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction7
            return res.status(200).json({ isSuccess, runOut: true });
        }

        //console.log(listTopping)
        return res.status(200).json({ isSuccess, invoice, products });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const getAllOrderInTransit = async (req, res) => {
    try {
        const staff = req.user;

        let invoices = await Invoice.findAll({
            where: {
                status: 2,
            },
            attributes: ['idInvoice', 'date', 'idUser'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let products = await getInvoiceProduct(item['idInvoice']);
            //console.log(cart)
            return {
                idInvoice: item['idInvoice'],
                date: item['date'],

                products,
            };
        });

        invoices = await Promise.all(promises);

        return res.status(200).json({ isSuccess: true, invoices });
    } catch (error) {
        res.status(500).json(error);
    }
};
const getAllInvoiceByDate = async (req, res) => {
    try {
        const staff = req.user;
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
            attributes: ['idInvoice', 'total', 'date', 'status', 'idUser'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let products = await getInvoiceProduct(item['idInvoice']);
            //console.log(cart)
            return {
                idInvoice: item['idInvoice'],
                total: item['total'],
                date: item['date'],

                products,
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
        const staff = req.user;

        let invoices = await Invoice.findAll({
            where: {
                status: 1,
            },
            attributes: ['idInvoice', 'date', 'idUser', 'total', 'shippingFee'],
            order: [['date', 'ASC']],

            raw: true,
        });

        const promises = invoices.map(async (item) => {
            let products = await getInvoiceProduct(item['idInvoice']);
            //console.log(cart)
            return {
                idInvoice: item['idInvoice'],
                date: item['date'],
                total: item['total'],
                shippingFee: item['shippingFee'],
                products,
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
            return res.status(400).json({ isSuccess: false, message: 'searchRecipe1' });
        }

        if (isNaN(req.query.limit) || req.query.name === undefined) {
            return res.status(400).json({ isSuccess: false, message: 'searchRecipe2' });
        }

        const name = req.query.name;
        const limit = Number(req.query.limit);

        let recipes = await Recipe.findAll({
            where: {
                isActive: 1,
                name: { [Op.like]: `%${name}%` },
                idType: { [Op.ne]: 5 },
            },
            attributes: ['idRecipe', 'name', 'image', 'price', 'discount'],
            limit: limit,
            raw: true,
        });

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
    getInvoiceProduct,
    searchRecipe,
    changeIngredientByCart,
};
