const { Shop, Ingredient, Type, Recipe_shop, Recipe, Recipe_type, Recipe_ingredient, Invoice, Staff, Account, Import, Export, Ingredient_shop, Revenue_statistic } = require("../models");
const { QueryTypes, Op, where, STRING, NUMBER } = require("sequelize");
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone'); // require
const { getDetailCart } = require("./order.controllers");
const { raw } = require("body-parser");

const deleteStaffWithTransaction = async (account, staff) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    let isSuccess
    try {
        //console.log('test2')

        await staff.destroy({ transaction: t });
        await account.destroy({ transaction: t });





        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true
    } catch (error) {
        isSuccess = false
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction

    }

    return isSuccess
}

const createManagerWithTransaction = async (phone, password, name, idShop) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    let isSuccess
    try {
        //console.log('test2')
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        //console.log('test3')
        const newAccount = await Account.create({
            phone,
            role: 2,
            password: hashPassword,

        }, { transaction: t });
        //console.log('test4')
        const newStaff = await Staff.create({
            idAcc: newAccount.idAcc,
            name,
            idShop,
            isShare: 1,

        }, { transaction: t });

        //console.log('test5')
        //console.log('test3')


        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true
    } catch (error) {
        isSuccess = false
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction

    }

    return isSuccess
}

const getTotal = (listInvoices) => {
    let total = 0
    //let total =0

    listInvoices.forEach((invoice) => {
        total += invoice.total
        console.log(invoice.total)
    });

    return total
}
const getTotalAndTotalImportAllShop = async (dateRangeArray) => {
    let listTotalAndTotalAmountImpot = []

    for (var i = 0; i < dateRangeArray.length; i++) {

        // Lấy đối tượng dateRange tại vị trí i
        var dateRange = dateRangeArray[i];

        // Lấy các giá trị từ đối tượng dateRange
        var startDate = dateRange.startDate;
        var endDate = dateRange.endDate;
        var month = dateRange.month;
        let invoices = await Invoice.findAll({
            where: {

                date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                },
                status: {
                    [Op.ne]: 0
                }

            },
            attributes: ['idInvoice', 'date', 'status', 'idCart', 'total'],
            //order: [['date', 'ASC']],

            raw: true,
        })
        let total = 0
        const promises = invoices.map(async item => {

            let detail = await getDetailCart(item['idCart'])
            total += item['total']
            return {

                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,

            };
        });

        invoices = await Promise.all(promises);
        let countInvoices = 0
        countInvoices = invoices.length
        // In ra các giá trị
        let { totalAmountImport } = await getChangeIngredientShopInfoAllShop(startDate, endDate, 0)

        var totalAndTotalAmountImport = {
            month: month,
            total: total,
            countInvoices: countInvoices,
            totalAmountImport: totalAmountImport
        };
        listTotalAndTotalAmountImpot.push(totalAndTotalAmountImport);

    }
    return listTotalAndTotalAmountImpot
}
const getTotalAndTotalImport = async (dateRangeArray, idShop) => {
    let listTotalAndTotalAmountImpot = []

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
                    [Op.lt]: endDate
                },
                status: {
                    [Op.ne]: 0
                }

            },
            attributes: ['idInvoice', 'date', 'status', 'idCart', 'total'],
            //order: [['date', 'ASC']],

            raw: true,
        })
        let total = 0
        const promises = invoices.map(async item => {

            let detail = await getDetailCart(item['idCart'])
            total += item['total']
            return {

                idInvoices: item['idInvoice'],
                date: item['date'],

                detail,

            };
        });

        invoices = await Promise.all(promises);
        let countInvoices = 0
        countInvoices = invoices.length
        // In ra các giá trị
        let { totalAmountImport } = await getChangeIngredientShopInfo(idShop, startDate, endDate, 0)

        var totalAndTotalAmountImport = {
            month: month,
            total: total,
            countInvoices: countInvoices,
            totalAmountImport: totalAmountImport
        };
        listTotalAndTotalAmountImpot.push(totalAndTotalAmountImport);

    }
    return listTotalAndTotalAmountImpot
}
const getChangeIngredientShopInfoAllShop = async (startDate, endDate, type) => {
    let imports = await Import.findAll({
        where: {

            date: {
                [Op.gte]: startDate,
                [Op.lt]: endDate
            },
        },
        attributes: ['idImport', 'idIngredient', 'date', 'price', 'quantity'],

        raw: true,
    })
    let totalAmountImport = 0;


    imports.forEach(importItem => {
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
                    [Op.lt]: endDate
                },
            },
            attributes: ['idExport', 'idIngredient', 'date', 'info', 'quantity'],

            raw: true,
        })
        let exportsWithoutBH = exports.filter(exportItem => !exportItem.info.startsWith('BH'));
        let exportsBH = exports.filter(exportItem => exportItem.info.startsWith('BH'));
        exportsBH = await getDetailChangeIngredient(exportsBH, 1)
        exportsWithoutBH = await getDetailChangeIngredient(exportsWithoutBH, 1)
        imports = await getDetailChangeIngredient(imports, 0)
        //console.log(exports)

        //console.log(imports, totalAmoutImport, exports, filteredExports)
        return { imports, totalAmountImport, exportsBH, exportsWithoutBH }
    } else return { totalAmountImport }

}
const getChangeIngredientShopInfo = async (idShop, startDate, endDate, type) => {
    let imports = await Import.findAll({
        where: {
            idShop: idShop,
            date: {
                [Op.gte]: startDate,
                [Op.lt]: endDate
            },
        },
        attributes: ['idImport', 'idIngredient', 'date', 'price', 'quantity'],

        raw: true,
    })
    let totalAmountImport = 0;


    imports.forEach(importItem => {
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
                    [Op.lt]: endDate
                },
            },
            attributes: ['idExport', 'idIngredient', 'date', 'info', 'quantity'],

            raw: true,
        })
        let exportsWithoutBH = exports.filter(exportItem => !exportItem.info.startsWith('BH'));
        let exportsBH = exports.filter(exportItem => exportItem.info.startsWith('BH'));
        exportsBH = await getDetailChangeIngredient(exportsBH, 1)
        exportsWithoutBH = await getDetailChangeIngredient(exportsWithoutBH, 1)
        imports = await getDetailChangeIngredient(imports, 0)
        //console.log(exports)

        //console.log(imports, totalAmoutImport, exports, filteredExports)
        return { imports, totalAmountImport, exportsBH, exportsWithoutBH }
    } else return { totalAmountImport }

}

const getDetailChangeIngredient = async (list, type) => {
    let ingredientQuantityMap = {};
    let ingredientDetailsList = [];
    if (type == 1) {
        //console.log('test1')
        list.forEach(item => {
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
    }


    else {
        //console.log('test2')
        list.forEach(item => {
            const ingredientId = item.idIngredient;
            const quantity = item.quantity;
            const price = item.price
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
                ingredient.total = ingredientData.total
                ingredientDetailsList.push(ingredient);

                //console.log('2');
            }

            // console.log('Ingredient Details List:', ingredientDetailsList);
        };

        await processIngredientDetails();
    }

    return ingredientDetailsList
}

const getTopSellerByInvoices = (listInvoices, quantity) => {
    const nameCounts = {};
    let countProducts = 0
    let countProductWithTopping = 0
    let countToppings = 0
    //let total =0
    const toppingCounts = {};
    listInvoices.forEach((invoice) => {
        invoice.detail.forEach((recipe) => {
            const name = recipe.name;
            const idRecipe = recipe.idRecipe;
            const quantityProduct = recipe.quantityProduct
            const image = recipe.image
            countProducts += quantityProduct
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
                countProductWithTopping += quantityProduct
            }
            recipe.listTopping.forEach((item) => {
                const nameTopping = item.name;
                const idItem = item.idRecipe;
                const quantity = item.quantity * quantityProduct
                const imageTopping = item.image
                countToppings += quantity
                if (toppingCounts[nameTopping]) {
                    toppingCounts[nameTopping].count += quantity;
                } else {
                    toppingCounts[nameTopping] = {
                        count: quantity,
                        idRecipes: idItem,
                        image: imageTopping
                    };
                }
            })
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

    return { topNames, topToppings, countProducts, countToppings, countProductWithTopping }
}



const getSixMonthInputAndOuput = async (req, res) => {
    try {
        //const staff = req.staff
        const { idShop } = req.params
        var currentDate = moment();

        var dateRangeArray = [];

        for (var i = 5; i >= 0; i--) {
            var endDate = moment(currentDate).subtract(i, 'months').endOf('month').toDate();
            var startDate = moment(endDate).startOf('month').toDate();
            var month = moment(endDate).month();
            var dateRange = {
                month: month + 1,
                startDate: startDate,
                endDate: endDate
            };
            dateRangeArray.push(dateRange);
        }
        // Lặp qua mảng dateRangeArray
        let listTotalAndTotalAmountImport = await getTotalAndTotalImport(dateRangeArray, idShop)

        //console.log(dateRangeArray);


        // let { imports, totalAmountImport, exportsBH, exportsWithoutBH } = await getChangeIngredientShopInfo(staff.idShop, startDate, endDate, 1)

        return res.status(200).json({ isSuccess: true, listTotalAndTotalAmountImport, idShop });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getSixMonthInputAndOuputAllShop = async (req, res) => {
    try {
        //const staff = req.staff

        var currentDate = moment();

        var dateRangeArray = [];

        for (var i = 5; i >= 0; i--) {
            var endDate = moment(currentDate).subtract(i, 'months').endOf('month').toDate();
            var startDate = moment(endDate).startOf('month').toDate();
            var month = moment(endDate).month();
            var dateRange = {
                month: month + 1,
                startDate: startDate,
                endDate: endDate
            };
            dateRangeArray.push(dateRange);
        }
        // Lặp qua mảng dateRangeArray
        let listTotalAndTotalAmountImport = await getTotalAndTotalImportAllShop(dateRangeArray)

        //console.log(dateRangeArray);


        // let { imports, totalAmountImport, exportsBH, exportsWithoutBH } = await getChangeIngredientShopInfo(staff.idShop, startDate, endDate, 1)

        return res.status(200).json({ isSuccess: true, listTotalAndTotalAmountImport });
    } catch (error) {
        res.status(500).json({ error, mes: 'reportByDate' });
    }
};
const getListManager = async (req, res) => {
    try {


        let listStaffs = await Account.findAll({
            where: { [Op.or]: [{ role: 2 }, { role: 3 }] },
            attributes: ['idAcc', 'phone', 'role'],
            include: [
                {
                    model: Staff,
                    attributes: ['idStaff', 'idShop', 'name'],
                    required: true,
                }
            ],
            raw: true,

        })

        listStaffs = listStaffs.map(item => {

            return {
                idStaff: item['Staff.idStaff'],
                name: item['Staff.name'],
                idShop: item['Staff.idShop'],
                phone: item['phone'],
                role: item['role'],
            }
        });
        return res.status(200).json({ isSuccess: true, listStaffs });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListStaff' });
    }
};
const getListShop = async (req, res) => {
    try {


        let listShops = await Shop.findAll({

            attributes: ['idShop', 'address', 'image', 'isActive', 'latitude', 'longitude'],

            //raw: true,

        })

        // listStaffs = listStaffs.map(item => {

        //      return {
        //         idStaff: item['Staff.idStaff'],
        //         name: item['Staff.name'],
        //         idShop: item['Staff.idShop'],
        //         phone: item['phone'],

        //     }
        // });
        return res.status(200).json({ isSuccess: true, listShops });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListStaff' });
    }
};
const deleteManager = async (req, res) => {
    try {
        const staff = req.staff
        const account = req.account

        if (account.role === 2) {
            let infoStaff = await Staff.findOne({
                where: { idAcc: account.idAcc }
            })

            let isSuccess = await deleteStaffWithTransaction(account, infoStaff)

            return res.status(200).json({ isSuccess });
        }
        else return res.status(403).json({ message: "Bạn không có quyền sử dụng chức năng này!" });

    } catch (error) {
        res.status(500).json({ error, mes: 'editStaff' });
    }
};
const editIngredient = async (req, res) => {
    try {
        let ingredient = req.ingredient
        const { name, unitName, image, isDel } = req.body;



        if (name) {
            ingredient.name = name;
        }
        if (unitName) {
            ingredient.unitName = unitName
        }
        if (image) {
            ingredient.image = image;
        }
        if (isDel) {
            if (Number(isDel) == 1) {
                ingredient.isDel = 1
            }
            else {
                ingredient.isDel = 0
            }
        }
        await ingredient.save()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'editManager' });
    }
};
const editManager = async (req, res) => {
    try {
        const staff = req.staff
        const { idStaff } = req.params
        const { phone, name, password, idShop } = req.body;

        let infoStaff = await Staff.findOne({
            where: { idStaff: idStaff },

        })
        if (!infoStaff) return res.status(409).send({ isSuccess: false, mes: 'Nhân viên không tồn tại' })
        let account = await Account.findOne({
            where: { idAcc: infoStaff.idAcc }
        })
        if (!account) return res.status(409).send({ isSuccess: false, mes: 'Tài khoản không tồn tại' })
        if (phone) {
            account.phone = phone;
        }
        if (idShop) {
            infoStaff.idShop = idShop
        }
        if (name) {
            infoStaff.name = name;
        }
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            account.password = hashPassword
        }
        await account.save()
        await infoStaff.save()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'editManager' });
    }
};
const editShop = async (req, res) => {
    try {
        const staff = req.staff
        const { idShop } = req.params
        const { address, image, latitude, longitude, isActive } = req.body;

        let infoShop = await Shop.findOne({
            where: { idShop: idShop },

        })
        //console.log(1)
        if (!infoShop) return res.status(409).send({ isSuccess: false, mes: 'Shop không tồn tại' });;
        if (image) {
            infoShop.image = image;
        }
        if (isActive) {
            if (Number(isActive) != 1) {
                infoShop.isActive = 0;
            }
            else {
                infoShop.isActive = 1
            }
        }
        if (latitude && longitude && address) {
            if (isNaN(latitude) || isNaN(longitude)) return res.status(400).json({ isSuccess: false, mes: 'Một trong hai lati hoặc longi không phải số' });
            infoShop.latitude = Number(latitude)
            infoShop.longitude = Number(longitude)
            infoShop.address = address;
        }

        await infoShop.save()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'editShop' });
    }
};

const addManager = async (req, res) => {
    try {
        const staff = req.staff
        const { phone, password, name, idShop } = req.body;
        if (phone === '' || password === '' || name === '' || idShop === '') {
            return res.status(400).json({ isSuccess: false, mes: 'addManager1' });
        }
        if (isNaN(phone) || isNaN(idShop) || password === undefined || name === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'addManager2' });
        }
        let isSuccess = await createManagerWithTransaction(phone, password, name, idShop)


        return res.status(200).json({ isSuccess });
    } catch (error) {
        res.status(500).json({ error, mes: 'addManager' });
    }
};
const addShop = async (req, res) => {
    try {

        let { address, image, latitude, longitude, isActive } = req.body;

        if (latitude === '' || longitude === '' || address === '' || image === '' || isActive === '') {
            return res.status(400).json({ isSuccess: false, mes: 'addShop1' });
        }
        if (isNaN(latitude) || isNaN(longitude) || isNaN(isActive) || address === undefined || image === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'addShop2' });
        }
        if (Number(isActive) == 1) {
            isActive = 1
        }
        else {
            isActive = 0
        }

        const newShop = await Shop.create({
            address,
            longitude,
            latitude,
            isActive,
            image,

        });


        return res.status(200).json({ isSuccess: true, newShop });
    } catch (error) {
        res.status(500).json({ error, mes: 'addShop' });
    }
};
const getListIngredient = async (req, res) => {
    try {
        const listIngredient = await Ingredient.findAll({

        })

        return res.status(200).json({ isSuccess: true, listIngredient });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListIngredient' });
    }
};
const addIngredient = async (req, res) => {
    try {
        const { image, unitName, name } = req.body;
        if (image === '' || unitName === '' || name === '') {
            return res.status(400).json({ isSuccess: false, mes: 'addIngredient1' });
        }
        if (image === undefined || unitName === undefined || name === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'addIngredient2' });
        }
        const newIngredient = await Ingredient.create({
            name,
            image,
            unitName,

        });

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error, mes: 'addIngredient' });
    }
};
const addRecipe = async (req, res) => {
    try {
        const { image, info, name, price, idType } = req.body;

        const newRecipe = await Recipe.create({
            name,
            image,
            info,
            price,
            idType,

        });

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error, mes: 'addIngredient' });
    }
};
const editRecipe = async (req, res) => {
    try {

        const { image, info, name, price, idType, isDel } = req.body;
        const { idRecipe } = req.params
        let infoRecipe = await Recipe.findOne({
            where: { idRecipe: idRecipe },

        })


        if (name) {
            infoRecipe.name = name;
        }
        if (image) {
            infoRecipe.image = image;
        }
        if (info) {
            infoRecipe.info = info;
        }
        if (idType) {
            const type = await Type.findOne({
                where: {
                    idType: idType
                }
            })
            if (!type) return res.status(400).json({ isSuccess: false, mes: 'Không tồn tại idType này' });
            infoRecipe.idType = idType

        }
        if (price) {
            infoRecipe.price = price;
        }
        if (isDel) {
            if (Number(isDel) == 1) {
                infoRecipe.isDel = 1
            }
            else {
                infoRecipe.isDel = 0
            }
        }
        await infoRecipe.save()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'editManager' });
    }
};
const editRecipeIngredient = async (req, res) => {
    try {

        const { quantity } = req.body;

        const recipe = req.recipe
        const ingredient = req.ingredient
        let [recipe_ingredient, created] = await Recipe_ingredient.findOrCreate({
            where: {
                idRecipe: recipe.idRecipe,
                idIngredient: ingredient.idIngredient
            }
        });
        if (isNaN(quantity)) return res.status(400).json({ isSuccess: false, mes: 'quantity phải là số và lớn hơn bằng 0' });
        if (Number(quantity) < 0) return res.status(400).json({ isSuccess: false, mes: 'quantity phải là số và lớn hơn bằng 0' });
        if (Number(quantity) == 0) {
            await recipe_ingredient.destroy()
            return res.status(200).json({ isSuccess: true });
        }
        recipe_ingredient.quantity = quantity
        await recipe_ingredient.save()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'editManager' });
    }
};
const addRecipeType = async (req, res) => {
    try {



        const recipe = req.recipe
        const type = req.type
        
        let recipe_type = await Recipe_type.findOrCreate({
            where:{
                idRecipe: recipe.idRecipe,
                idType: type.idType
            }
          
        });
        if(!recipe_type) return res.status(400).json({ isSuccess: true });
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'addRecipeType' });
    }
};
const deleteRecipeType = async (req, res) => {
    try {



        const recipe = req.recipe
        const type = req.type
        
        let recipe_type = await Recipe_type.findOne({
            where:{
                idRecipe: recipe.idRecipe,
                idType: type.idType
            }
          
        });
        if(!recipe_type) return res.status(404).json({ isSuccess: true, mes:'Không tồn tại liên kết recipe_type này' });
        await recipe_type.destroy()
        return res.status(200).json({ isSuccess: true });


    } catch (error) {
        res.status(500).json({ error, mes: 'addRecipeType' });
    }
};
const getListRecipeAdmin = async (req, res) => {
    try {


        let listType = []
        let listRecipes

        if (req.query.idType !== '') {

            listType = req.query.idType.split(',').map(Number);
            listRecipes = await Recipe.findAll({
                where: {
                    idType: { [Op.in]: listType }
                },

            })
        }
        else {

            listRecipes = await Recipe.findAll({


            })
        }
        return res.status(200).json({ isSuccess: true, listRecipes });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListRecipeAdmin' });
    }
};
const getListType = async (req, res) => {
    try {

        let listType = await Type.findAll({
            include: {
                model: Recipe_type,
                include: [
                    {
                        model: Recipe,
                        attributes: ['name', 'info', 'price', 'image', 'isDel'],
                        
                    }
                ]
            },
            //raw:true,
        })
        listType.forEach((type) => {
            type.Recipe_types.forEach((recipe) => {
                recipe.dataValues.name = recipe.Recipe.dataValues.name
                recipe.dataValues.info = recipe.Recipe.dataValues.info
                recipe.dataValues.price = recipe.Recipe.dataValues.price
                recipe.dataValues.image = recipe.Recipe.dataValues.image
                recipe.dataValues.isDel = recipe.Recipe.dataValues.isDel
                delete recipe.dataValues.idType
                delete recipe.dataValues.Recipe
            });
            type.dataValues.listToppings = type.dataValues.Recipe_types
            delete type.dataValues.Recipe_types
        });
        return res.status(200).json({ isSuccess: true, listType });
    } catch (error) {
        res.status(500).json({ error, mes: 'getListRecipeAdmin' });
    }
};
const getIngredientByIdRecipeAdmin = async (idRecipe) => {

    let ingredients = await Recipe_ingredient.findAll({
        where: { idRecipe },
        include: [{
            model: Ingredient,

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
    });
    return ingredients
}
const detailRecipeAdmin = async (req, res) => {
    try {

        //const staff = req.staff
        const { idRecipe } = req.params
        //console.log(staff.idShop)

        if (idRecipe === '' || isNaN(idRecipe)) {
            return res.status(400).json({ isSuccess: false, mes: 'detailRecipeAdmin1' });
        }

        let detailRecipe = await Recipe.findOne({
            where: { idRecipe },

            raw: true,
        })

        let ingredients = await getIngredientByIdRecipeAdmin(idRecipe)
        console.log(1)
        let listTopping = await Recipe_type.findAll({
            where: { idType: detailRecipe.idType },
            //attributes: [['name', 'Recipe.name']],
            attributes: [
                'idRecipe',
            ],
            required: true,
            include: [
                {
                    model: Recipe,
                    attributes: ['name', 'price', 'image'],
                    required: true,

                }
            ],
            raw: true
        })
        console.log(2)
        listTopping = listTopping.map(item => {
            return {

                idRecipe: item['idRecipe'],
                name: item['Recipe.name'],

                price: item['Recipe.price'],
                image: item['Recipe.image']
            };
        });
        //console.log(listTopping)
        console.log(3)
        detailRecipe.ingredients = ingredients
        detailRecipe.listTopping = listTopping


        return res.status(200).json({ isSuccess: true, detailRecipe });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra  lỗi getDetailRecipeAdmin' });
    }
};
module.exports = {

    getListManager, addManager, editManager, deleteManager, getSixMonthInputAndOuput,
    getListShop, editShop, addShop, getSixMonthInputAndOuputAllShop, getListIngredient,
    addIngredient, editIngredient, getListRecipeAdmin, detailRecipeAdmin, addRecipe, editRecipe,
    editRecipeIngredient, getListType, addRecipeType, deleteRecipeType
};