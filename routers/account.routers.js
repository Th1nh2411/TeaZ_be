const express = require('express');
const { Account } = require('../models');
const {
    login,
    logout,
    createAccountForCustomer,
    changePassword,
    forgotPassword,
    loginAdmin,
    verify,
    accessForgotPassword,
} = require('../controllers/account.controllers');
const { checkExistAccount, checkNotExistAcount } = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { checkCreateAccount } = require('../middlewares/validates/checkCreate');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const accountRouter = express.Router();

accountRouter.post('/login', checkExistAccount(), login);
//accountRouter.post("/admin/login", checkExistAccount(Account), loginAdmin);
//accountRouter.get("/logout", authenticate, logout);
accountRouter.post('/create', checkNotExistAcount(), createAccountForCustomer);
//accountRouter.post("/forgotpassword", checkExistAccount(Account), forgotPassword);
//accountRouter.post("/forgotpassword/verify", checkExistAccount(Account), verify);
//accountRouter.post("/forgotpassword/verify/success", checkExistAccount(Account), accessForgotPassword);
//accountRouter.put("/changepassword", authenticate, changePassword);

module.exports = {
    accountRouter,
};
