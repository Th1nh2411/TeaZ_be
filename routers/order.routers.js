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
// orderRouter.get('/topping', getToppingOptions);
orderRouter.get('/search', searchRecipe);
orderRouter.get('/currentCart', authenticate, authorize(0), checkExistCurrentCart(), getCurrentCart);
orderRouter.post('/addToCart', authenticate, authorize(0), checkExistCurrentCart(), checkExistProduct(), addToCart);
orderRouter.post(
    '/editProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistProduct(),
    checkExistCurrentCart(),
    checkExistProductCartAndDel(),
    addToCart,
);
orderRouter.delete(
    '/deleteProductCart/:oldIdProduct',
    authenticate,
    authorize(0),
    checkExistCurrentCart(),
    checkExistProductCartAndDel(),
    confirmDeleteProductCart,
);

orderRouter.delete('/deleteProductCart', authenticate, authorize(0), checkExistCurrentCart(), delAllItemCart);

orderRouter.get('/getListCompanies', getListCompanies);
orderRouter.get('/getShipFee', getShipFee);
orderRouter.get('/getCurrentInvoice', authenticate, authorize(0), getCurrentInvoice);
orderRouter.get('/getAllInvoice', authenticate, authorize(0), getAllInvoiceUser);
orderRouter.get('/getDetailInvoice/:idInvoice', authenticate, authorize(0), getDetailInvoice);
orderRouter.post(
    '/createInvoice',
    authenticate,
    authorize(0),
    checkExistCurrentCart(),
    checkExistInvoiceLessThan3(),
    createInvoice,
);

orderRouter.put('/confirmInvoice', authenticate, authorize(0), checkExistInvoiceStatus(0), confirmInvoice);
orderRouter.delete('/cancelInvoice', authenticate, authorize(0), cancelInvoice);
// Manage
orderRouter.get('/getAllOrder', authenticate, authorize(1), getAllOrder);
orderRouter.get('/getAllOrderInTransit', authenticate, authorize(1), getAllOrderInTransit);
orderRouter.put('/completeOrder', authenticate, authorize(1), checkExistInvoiceStatus(1), changeStatusInvoice);
orderRouter.put('/completeInvoice', authenticate, authorize(1), checkExistInvoiceStatus(2), changeStatusInvoice);
orderRouter.get('/reportByDate/:date', authenticate);
orderRouter.get('/getAllInvoiceByDate/:date', authenticate, authorize(1), getAllInvoiceByDate);

module.exports = {
    orderRouter,
};
