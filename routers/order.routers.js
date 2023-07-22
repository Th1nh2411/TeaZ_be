const express = require('express');

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
    testInvoice,
} = require('../controllers/order.controllers');
const {
    checkExistProduct,
    checkExistCurrentCart,
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
orderRouter.post('/addToCart', authenticate, authorize(0), checkExistProduct(), checkExistCurrentCart(), addToCart);
orderRouter.delete('/deleteProductCart', authenticate, authorize(0), checkExistCurrentCart(), delAllItemCart);
orderRouter.delete(
    '/deleteProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistCurrentCart(),
    checkExistProductCartAndDel(),
    confirmDeleteProductCart,
);
orderRouter.post(
    '/editProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistProduct(),
    checkExistCurrentCart(),
    checkExistProductCartAndDel(),
    addToCart,
);
orderRouter.get('/getShipFee', getShipFee);
orderRouter.get('/getCurrentInvoice', authenticate, authorize(0), getCurrentInvoice);
orderRouter.get('/getAllInvoice', authenticate, authorize(0), getAllInvoiceUser);
orderRouter.get('/getDetailInvoice/:idInvoice', authenticate, authorize(0), getDetailInvoice);
orderRouter.delete('/cancelInvoice', authenticate, authorize(0), cancelInvoice);
orderRouter.post(
    '/createInvoice',
    authenticate,
    authorize(0),
    checkExistCurrentCart(),
    checkExistInvoiceLessThan3(),
    createInvoice,
);
orderRouter.post(
    '/testInvoice',
    authenticate,
    authorize(0),
    checkExistCurrentCart(),
    checkExistInvoiceLessThan3(),
    testInvoice,
);
orderRouter.put('/confirmInvoice', authenticate, authorize(0), checkExistInvoiceStatus(0), confirmInvoice);
// Manage
orderRouter.get('/getAllOrder', authenticate, authorize(1), getAllOrder);
orderRouter.get('/getAllOrderInTransit', authenticate, authorize(1), getAllOrderInTransit);
orderRouter.get('/getAllInvoiceByDate/:date', authenticate, authorize(1), getAllInvoiceByDate);
orderRouter.put('/completeOrder', authenticate, authorize(1), checkExistInvoiceStatus(1), changeStatusInvoice);
orderRouter.get('/reportByDate/:date', authenticate);
orderRouter.put('/completeInvoice', authenticate, authorize(1), checkExistInvoiceStatus(2), changeStatusInvoice);
orderRouter.get('/getListCompanies', getListCompanies);

module.exports = {
    orderRouter,
};
