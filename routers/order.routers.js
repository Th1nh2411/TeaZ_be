const express = require('express');
const moment = require('moment');

const {
    getToppingOptions,
    addToCart,
    getCurrentCart,
    getShipFee,
    getListCompanies,
    createInvoice,
    delAllItemCart,
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
    searchRecipe,
} = require('../controllers/order.controllers');
const {
    checkExistProduct,
    checkExistProductCartAndDel,
    checkExistInvoiceStatus,
    checkExistInvoiceLessThan3,
} = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const orderRouter = express.Router();

// Customer
orderRouter.get('/topping', getToppingOptions);
orderRouter.get('/search', searchRecipe);
orderRouter.get('/currentCart', authenticate, authorize(0), getCurrentCart);
orderRouter.post('/addToCart', authenticate, authorize(0), checkExistProduct(), addToCart);
orderRouter.post(
    '/editProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistProduct(),
    checkExistProductCartAndDel(),
    addToCart,
);
orderRouter.delete(
    '/deleteProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistProductCartAndDel(),
    confirmDeleteProductCart,
);

orderRouter.delete('/deleteProductCart', authenticate, authorize(0), delAllItemCart);

orderRouter.get('/getListCompanies', getListCompanies);
orderRouter.get('/getShipFee', getShipFee);
orderRouter.get('/getCurrentInvoice', authenticate, authorize(0), getCurrentInvoice);
orderRouter.get('/getAllInvoice', authenticate, authorize(0), getAllInvoiceUser);
orderRouter.get('/getDetailInvoice/:idInvoice', authenticate, authorize(0), getDetailInvoice);
orderRouter.post('/createInvoice', authenticate, authorize(0), checkExistInvoiceLessThan3(), createInvoice);

orderRouter.put('/confirmInvoice', authenticate, authorize(0), checkExistInvoiceStatus(0), confirmInvoice);
orderRouter.delete('/cancelInvoice', authenticate, authorize(0), cancelInvoice);
// Manage
orderRouter.get('/getAllOrder', authenticate, authorize(1), getAllOrder);
orderRouter.get('/getAllOrderInTransit', authenticate, authorize(1), getAllOrderInTransit);
orderRouter.put('/completeOrder', authenticate, authorize(1), checkExistInvoiceStatus(1), changeStatusInvoice);
orderRouter.put('/completeInvoice', authenticate, authorize(1), checkExistInvoiceStatus(2), changeStatusInvoice);
orderRouter.get('/reportByDate/:date', authenticate);
orderRouter.get('/getAllInvoiceByDate/:date', authenticate, authorize(1), getAllInvoiceByDate);
orderRouter.post('/create_payment_url', function (req, res, next) {
    var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('../config/vnpay_config.json');

    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;
    var vnpUrl = config.vnp_Url;
    var returnUrl = config.vnp_ReturnUrl;

    var date = new Date();

    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let orderId = moment(date).format('DDHHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    var locale = req.body.language;
    if (locale === null || locale === '' || locale === undefined) {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '' && bankCode !== undefined) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // res.redirect(vnpUrl);
    // res.render('success', { url: vnpUrl });
    return res.status(200).json({ isSuccess: true, url: vnpUrl });
});
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}
// Vui lòng tham khảo thêm tại code demo

module.exports = {
    orderRouter,
};
