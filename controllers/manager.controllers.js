const {
    Shop,
    Ingredient,
    Recipe_shop,
    Recipe,
    Invoice,
    Staff,
    Account,
    Import,
    Export,
    Ingredient_shop,
} = require('../models');
const { QueryTypes, Op, where, STRING } = require('sequelize');
const db = require('../models/index');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone'); // require
const { getDetailCart } = require('./order.controllers');

const deleteStaffWithTransaction = async (account, staff) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    let isSuccess;
    try {
        //console.log('test2')

        await staff.destroy({ transaction: t });
        await account.destroy({ transaction: t });

        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true;
    } catch (error) {
        isSuccess = false;
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
    }

    return isSuccess;
};

const createStaffWithTransaction = async (phone, password, name, idShop, role) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    let isSuccess;
    try {
        //console.log('test2')
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        //console.log('test3')
        const newAccount = await Account.create(
            {
                phone,
                role: 1,
                password: hashPassword,
            },
            { transaction: t },
        );
        //console.log('test4')
        const newStaff = await Staff.create(
            {
                idAcc: newAccount.idAcc,
                name,
                idShop,
                isShare: 1,
            },
            { transaction: t },
        );

        //console.log('test5')
        //console.log('test3')

        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true;
    } catch (error) {
        isSuccess = false;
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
    }

    return isSuccess;
};

const getTotal = (listInvoices) => {
    let total = 0;
    //let total =0

    listInvoices.forEach((invoice) => {
        total += invoice.total;
        console.log(invoice.total);
    });

    return total;
};
const getTotalAndTotalImport = async (dateRangeArray, idShop) => {
    let listTotalAndTotalAmountImpot = [];

    for (var i = 0; i < dateRangeArray.length; i++) {
        // Lấy đối tượng dateRange tại vị trí i
        var dateRange = dateRangeArray[i];

        // Lấy các giá trị từ đối tượng dateRange
        var startDate = dateRange.startDate;
        var endDate = dateRange.endDate;
        var month = dateRange.month;
        let invoices = await Invoice.findAll({
            where: {
                idShop: idShop,
                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                },
                status: {
                    [Op.ne]: 0,
                },
            },
            attributes: ['idInvoice', 'date', 'status', 'idCart', 'total'],
            //order: [['date', 'ASC']],

            raw: true,
        });
        let total = 0;
        const promises = invoices.map(async (item) => {
            let detail = await getDetailCart(item['idCart']);
            total += item['total'];
            return {
                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,
            };
        });

        invoices = await Promise.all(promises);
        let countInvoices = 0;
        countInvoices = invoices.length;
        // In ra các giá trị
        let { totalAmountImport } = await getChangeIngredientShopInfo(idShop, startDate, endDate, 0);

        var totalAndTotalAmountImport = {
            month: month,
            total: total,
            countInvoices: countInvoices,
            totalAmountImport: totalAmountImport,
        };
        listTotalAndTotalAmountImpot.push(totalAndTotalAmountImport);
    }
    return listTotalAndTotalAmountImpot;
};
const getChangeIngredientShopInfo = async (idShop, startDate, endDate, type) => {
    let imports = await Import.findAll({
        where: {
            idShop: idShop,
            date: {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            },
        },
        attributes: ['idImport', 'idIngredient', 'date', 'price', 'quantity'],

        raw: true,
    });
    let totalAmountImport = 0;

    imports.forEach((importItem) => {
        const price = importItem.price;
        const quantity = importItem.quantity;

        const importAmount = price * quantity;
        totalAmountImport += importAmount;
    });
    if (type == 1) {
        let exports = await Export.findAll({
            where: {
                idShop: idShop,
                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                },
            },
            attributes: ['idExport', 'idIngredient', 'date', 'info', 'quantity'],

            raw: true,
        });
        let exportsWithoutBH = exports.filter((exportItem) => !exportItem.info.startsWith('BH'));
        let exportsBH = exports.filter((exportItem) => exportItem.info.startsWith('BH'));
        exportsBH = await getDetailChangeIngredient(exportsBH, 1);
        exportsWithoutBH = await getDetailChangeIngredient(exportsWithoutBH, 1);
        imports = await getDetailChangeIngredient(imports, 0);
        //console.log(exports)

        //console.log(imports, totalAmoutImport, exports, filteredExports)
        return { imports, totalAmountImport, exportsBH, exportsWithoutBH };
    } else return { totalAmountImport };
};

const getDetailChangeIngredient = async (list, type) => {
    let ingredientQuantityMap = {};
    let ingredientDetailsList = [];
    if (type == 1) {
        //console.log('test1')
        list.forEach((item) => {
            const ingredientId = item.idIngredient;
            const quantity = item.quantity;

            if (ingredientQuantityMap.hasOwnProperty(ingredientId)) {
                ingredientQuantityMap[ingredientId].quantity += quantity;
            } else {
                ingredientQuantityMap[ingredientId] = {
                    quantity: quantity,
                };
            }
        });
        //console.log(ingredientQuantityMap)
        const processIngredientDetails = async () => {
            for (const [ingredientId, ingredientData] of Object.entries(ingredientQuantityMap)) {
                let ingredient = await Ingredient.findOne({
                    where: { idIngredient: ingredientId },
                    raw: true,
                });

                ingredient.quantity = ingredientData.quantity;

                ingredientDetailsList.push(ingredient);

                //console.log('2');
            }

            //console.log('Ingredient Details List:', ingredientDetailsList);
        };

        await processIngredientDetails();
        //console.log(ingredientDetailsList)
    } else {
        //console.log('test2')
        list.forEach((item) => {
            const ingredientId = item.idIngredient;
            const quantity = item.quantity;
            const price = item.price;
            if (ingredientQuantityMap.hasOwnProperty(ingredientId)) {
                ingredientQuantityMap[ingredientId].quantity += quantity;
                ingredientQuantityMap[ingredientId].total += Number(quantity * price);
            } else {
                ingredientQuantityMap[ingredientId] = {
                    quantity: quantity,
                    total: quantity * price,
                };
            }
        });
        //console.log(ingredientQuantityMap)
        const processIngredientDetails = async () => {
            for (const [ingredientId, ingredientData] of Object.entries(ingredientQuantityMap)) {
                let ingredient = await Ingredient.findOne({
                    where: { idIngredient: ingredientId },
                    raw: true,
                });

                ingredient.quantity = ingredientData.quantity;
                ingredient.total = ingredientData.total;
                ingredientDetailsList.push(ingredient);

                //console.log('2');
            }

            // console.log('Ingredient Details List:', ingredientDetailsList);
        };

        await processIngredientDetails();
    }

    return ingredientDetailsList;
};

const getTopSellerByInvoices = (listInvoices, quantity) => {
    const nameCounts = {};
    let countProducts = 0;
    let countProductWithTopping = 0;
    let countToppings = 0;
    //let total =0
    const toppingCounts = {};
    listInvoices.forEach((invoice) => {
        invoice.detail.forEach((recipe) => {
            const name = recipe.name;
            const idRecipe = recipe.idRecipe;
            const quantityProduct = recipe.quantityProduct;
            const image = recipe.image;
            countProducts += quantityProduct;
            if (nameCounts[name]) {
                nameCounts[name].count += quantityProduct;
            } else {
                nameCounts[name] = {
                    count: quantityProduct,
                    idRecipes: idRecipe,
                    image: image,
                };
            }
            if (recipe.listTopping != '') {
                countProductWithTopping += quantityProduct;
            }
            recipe.listTopping.forEach((item) => {
                const nameTopping = item.name;
                const idItem = item.idRecipe;
                const quantity = item.quantity * quantityProduct;
                const imageTopping = item.image;
                countToppings += quantity;
                if (toppingCounts[nameTopping]) {
                    toppingCounts[nameTopping].count += quantity;
                } else {
                    toppingCounts[nameTopping] = {
                        count: quantity,
                        idRecipes: idItem,
                        image: imageTopping,
                    };
                }
            });
        });
    });
    //console.log(countToppings)

    const sortedNames = Object.keys(nameCounts).sort((a, b) => nameCounts[b].count - nameCounts[a].count);
    const sortedToppings = Object.keys(toppingCounts).sort((a, b) => toppingCounts[b].count - toppingCounts[a].count);

    const topNames = sortedNames.slice(0, quantity).map((name) => ({
        name: name,
        idRecipes: nameCounts[name].idRecipes,
        image: nameCounts[name].image,
        count: nameCounts[name].count,
    }));

    const topToppings = sortedToppings.slice(0, quantity).map((name) => ({
        name: name,
        idRecipes: toppingCounts[name].idRecipes,
        image: toppingCounts[name].image,
        count: toppingCounts[name].count,
    }));

    return { topNames, topToppings, countProducts, countToppings, countProductWithTopping };
};

const getReportByDate = async (req, res) => {
    try {
        const staff = req.staff;
        const { date } = req.params;
        if (req.query.quantity == '' || req.query.quantity == undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        const quantity = req.query.quantity;
        if (req.query.type == '' || req.query.type == undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        const type = req.query.type;
        let startDate, endDate;
        if (type == 'day' || type == 'month' || type == 'year') {
            startDate = moment(date).startOf(type).toDate();
            endDate = moment(date).endOf(type).toDate();
        } else return res.status(400).json({ isSuccess: false, mes: 'type sai' });
        if (date === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (date === '') {
            return res.status(400).json({ isSuccess: false });
        }

        let invoices = await Invoice.findAll({
            where: {
                idShop: staff.idShop,
                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                },
                status: {
                    [Op.ne]: 0,
                },
            },
            attributes: ['idInvoice', 'date', 'status', 'idCart', 'total'],
            //order: [['date', 'ASC']],

            raw: true,
        });
        let total = 0;
        const promises = invoices.map(async (item) => {
            let detail = await getDetailCart(item['idCart']);
            total += item['total'];
            return {
                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,
            };
        });

        invoices = await Promise.all(promises);
        let countInvoices = 0;
        countInvoices = invoices.length;
        let { topNames, topToppings, countProducts, countToppings, countProductWithTopping } = getTopSellerByInvoices(
            invoices,
            quantity,
        );
        let { totalAmountImport } = await getChangeIngredientShopInfo(staff.idShop, startDate, endDate, 0);
        //console.log(imports,totalAmountImport, exports, filteredExports)
        return res
            .status(200)
            .json({
                isSuccess: true,
                total,
                totalAmountImport,
                topNames,
                topToppings,
                countProducts,
                countToppings,
                countProductWithTopping,
                countInvoices,
            });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getDetailChangeIngredientShop = async (req, res) => {
    try {
        const staff = req.staff;
        const { date } = req.params;

        if (req.query.type == '' || req.query.type == undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        const type = req.query.type;
        let startDate, endDate;
        if (type == 'day' || type == 'month' || type == 'year') {
            startDate = moment(date).startOf(type).toDate();
            endDate = moment(date).endOf(type).toDate();
        } else return res.status(400).json({ isSuccess: false, mes: 'type sai' });
        if (date === undefined) {
            return res.status(400).json({ isSuccess: false });
        }
        if (date === '') {
            return res.status(400).json({ isSuccess: false });
        }

        let { imports, totalAmountImport, exportsBH, exportsWithoutBH } = await getChangeIngredientShopInfo(
            staff.idShop,
            startDate,
            endDate,
            1,
        );

        return res.status(200).json({ isSuccess: true, imports, totalAmountImport, exportsBH, exportsWithoutBH });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getSixMonthInputAndOuput = async (req, res) => {
    try {
        const staff = req.staff;

        var currentDate = moment();

        var dateRangeArray = [];

        for (var i = 5; i >= 0; i--) {
            var endDate = moment(currentDate).subtract(i, 'months').endOf('month').toDate();
            var startDate = moment(endDate).startOf('month').toDate();
            var month = moment(endDate).month();
            var dateRange = {
                month: month + 1,
                startDate: startDate,
                endDate: endDate,
            };
            dateRangeArray.push(dateRange);
        }
        // Lặp qua mảng dateRangeArray
        let listTotalAndTotalAmountImport = await getTotalAndTotalImport(dateRangeArray, staff.idShop);

        //console.log(dateRangeArray);

        // let { imports, totalAmountImport, exportsBH, exportsWithoutBH } = await getChangeIngredientShopInfo(staff.idShop, startDate, endDate, 1)

        return res.status(200).json({ isSuccess: true, listTotalAndTotalAmountImport });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getListStaff = async (req, res) => {
    try {
        const staff = req.staff;

        let listStaffs = await Staff.findAll({
            where: { idShop: staff.idShop },
            attributes: ['idStaff', 'name'],
            include: [
                {
                    model: Account,
                    attributes: ['role', 'phone'],
                },
            ],
            raw: true,
        });

        listStaffs = listStaffs.map((item) => {
            return {
                idStaff: item['idStaff'],
                name: item['name'],
                role: item['Account.role'],
                phone: item['Account.phone'],
            };
        });
        return res.status(200).json({ isSuccess: true, listStaffs });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListStaff' });
    }
};
const deleteStaff = async (req, res) => {
    try {
        const staff = req.staff;
        const account = req.account;

        if (account.role === 1) {
            let infoStaff = await Staff.findOne({
                where: { idAcc: account.idAcc },
            });
            if (infoStaff.idShop !== staff.idShop)
                return res.status(403).json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
            let isSuccess = await deleteStaffWithTransaction(account, infoStaff);

            return res.status(200).json({ isSuccess });
        } else return res.status(403).json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
    } catch (error) {
        res.status(500).json({ error, mes: 'editStaff' });
    }
};
const editStaff = async (req, res) => {
    try {
        const staff = req.staff;
        const { idStaff } = req.params;
        const { phone, name, password } = req.body;
        console.log(2);
        console.log(idStaff);
        let infoStaff = await Staff.findOne({
            where: { idStaff: idStaff, idShop: staff.idShop },
        });
        console.log(1);
        if (!infoStaff) return res.status(409).send({ isSuccess: false, mes: 'Nhân viên không tồn tại' });
        let account = await Account.findOne({
            where: { idAcc: infoStaff.idAcc },
        });
        if (!account) return res.status(409).send({ isSuccess: false, mes: 'Tài khoản không tồn tại' });

        if (infoStaff.idShop !== staff.idShop)
            return res.status(403).json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
        if (phone) {
            account.phone = phone;
        }

        if (name) {
            infoStaff.name = name;
        }
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            account.password = hashPassword;
        }
        await account.save();
        await infoStaff.save();
        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error, mes: 'editStaff' });
    }
};

const addStaff = async (req, res) => {
    try {
        const staff = req.staff;
        const { phone, password, name } = req.body;
        if (phone === '' || password === '' || name === '') {
            return res.status(400).json({ isSuccess: false, mes: 'addStaff1' });
        }
        if (isNaN(phone) || password === undefined || name === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'addStaff2' });
        }
        let isSuccess = await createStaffWithTransaction(phone, password, name, staff.idShop, 1);

        return res.status(200).json({ isSuccess });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListStaff' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    getReportByDate,
    getListStaff,
    getDetailChangeIngredientShop,
    addStaff,
    editStaff,
    deleteStaff,
    getSixMonthInputAndOuput,
};
