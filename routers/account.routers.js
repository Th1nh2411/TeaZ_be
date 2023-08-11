const express = require('express');
const { Account } = require('../models');
const {
    login,
    logout,
    createAccountForCustomer,
    changePassword,
    sendOTPGmail,
    loginAdmin,
    verify,
    accessForgotPassword,
    refreshToken,
} = require('../controllers/account.controllers');
const { checkExistAccount, checkNotExistAccount } = require('../middlewares/validates/checkExist');
const { authorize } = require('../middlewares/auth/authorize.js');
const { checkCreateAccount } = require('../middlewares/validates/checkCreate');
const { authenticate } = require('../middlewares/auth/authenticate.js');
const accountRouter = express.Router();

accountRouter.post('/login', checkExistAccount(), login);
accountRouter.post('/refreshToken', checkExistAccount(), refreshToken);
//accountRouter.post("/admin/login", checkExistAccount(Account), loginAdmin);
//accountRouter.get("/logout", authenticate, logout);
accountRouter.post('/create', checkNotExistAccount(), createAccountForCustomer);
accountRouter.post('/forgotpassword', checkExistAccount(), sendOTPGmail);
accountRouter.post('/forgotpassword/verify', checkExistAccount(), verify);
accountRouter.post('/forgotpassword/changePw', checkExistAccount(), accessForgotPassword);
accountRouter.put('/changepassword', authenticate, changePassword);

module.exports = {
    accountRouter,
};
