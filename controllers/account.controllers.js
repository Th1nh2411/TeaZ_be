const { Account, User } = require('../models');
const db = require('../models/index');
const moment = require('moment-timezone'); // require

const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const createCustomerWithTransaction = async (phone, password, name, mail) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction

    let isSuccess;
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newAccount = await Account.create(
            {
                mail,
                phone,
                role: 0,
                password: hashPassword,
            },
            { transaction: t },
        );

        const newCustomer = await User.create(
            {
                idAcc: newAccount.idAcc,
                name,
            },
            { transaction: t },
        );

        // console.log('test5');
        //console.log('test3')

        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true;
    } catch (error) {
        isSuccess = false;
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
    }

    return isSuccess;
};

const createAccountForCustomer = async (req, res) => {
    try {
        const { phone, password, name, mail } = req.body;
        if (phone === '' || password === '' || name === '' || mail === '') {
            return res.status(400).json({ isSuccess: false, message: 'addUser1' });
        }
        if (isNaN(phone) || password === undefined || name === undefined || mail === undefined) {
            return res.status(400).json({ isSuccess: false, message: 'addUser2' });
        }
        //tạo ra một chuỗi ngẫu nhiên
        let isSuccess = await createCustomerWithTransaction(phone, password, name, mail);

        res.status(200).json({
            isSuccess,
        });
    } catch (error) {
        res.status(500).json({
            isExist: true,
            isSuccess: false,
        });
    }
};
//tam thoi chua co

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const account = req.account;
        const isAuth = bcrypt.compareSync(password, account.password);

        if (isAuth) {
            let userInfo;
            userInfo = await User.findOne({
                where: {
                    idAcc: account.idAcc,
                },
            });

            const token = jwt.sign({ phone: account.phone, mail: account.mail }, 'hehehe', {
                expiresIn: 7 * 24 * 60 * 60,
            });
            // userInfo.dataValues.phone = phone;
            userInfo.dataValues.role = account.role;
            userInfo.dataValues.phone = account.phone;
            userInfo.dataValues.mail = account.mail;

            res.status(200).json({
                userInfo,
                isSuccess: true,

                token,

                expireTime: 7 * 24 * 60 * 60,
            });
        } else {
            return res.status(401).json({ isSuccess: false });
        }
    } catch (error) {
        return res.status(500).json({ isSuccess: false });
    }
};
const refreshToken = async (req, res) => {
    try {
        const account = req.account;
        let userInfo;
        userInfo = await User.findOne({
            where: {
                idAcc: account.idAcc,
            },
        });

        const token = jwt.sign({ phone: account.phone, mail: account.mail }, 'hehehe', {
            expiresIn: 7 * 24 * 60 * 60,
        });
        // userInfo.dataValues.phone = phone;
        userInfo.dataValues.role = account.role;
        userInfo.dataValues.phone = account.phone;
        userInfo.dataValues.mail = account.mail;

        res.status(200).json({
            userInfo,
            isSuccess: true,
            token,
            expireTime: 7 * 24 * 60 * 60,
        });
    } catch (error) {
        return res.status(500).json({ isSuccess: false });
    }
};
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const accountUpdate = req.account;
        const isAuth = bcrypt.compareSync(oldPassword, accountUpdate.password);
        if (isAuth) {
            if (newPassword == oldPassword) {
                res.status(400).json({
                    status: true,
                    message: 'Mật khẩu mới trùng với mật khẩu cũ',
                    isSuccess: false,
                });
            } else {
                //tạo ra một chuỗi ngẫu nhiên
                const salt = bcrypt.genSaltSync(10);
                //mã hoá salt + password
                const hashPassword = bcrypt.hashSync(newPassword, salt);

                accountUpdate.password = hashPassword;
                await accountUpdate.save();
                res.status(200).json({
                    status: true,
                    isSuccess: true,
                    message: 'Đổi mật khẩu thành công',
                });
            }
        } else {
            res.status(400).json({
                status: false,
                isSuccess: false,
                message: 'Mật khẩu cũ không đúng',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: true,
            isSuccess: false,
        });
    }
};

const logout = async (req, res, next) => {
    res.removeHeader('access_token');

    res.status(200).json({ isSuccess: true });
};

const forgotPassword = async (req, res) => {
    const account = req.account;
    try {
        const randomID = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        const isExist1 = await Account.findOne({
            where: {
                forgot: randomID,
            },
        });
        if (isExist1 !== null) {
            res.status(400).json({
                isExist: true,
                isSuccess: false,
            });
        } else {
            await Account.sequelize.query('UPDATE accounts SET forgot = :randomID WHERE idAcc = :idAcc', {
                type: QueryTypes.UPDATE,
                replacements: {
                    randomID: randomID,
                    idAcc: account.idAcc,
                },
            });
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'n19dccn196@student.ptithcm.edu.vn', // generated ethereal user
                    pass: 'oqrkvehhclgnbzjf', // generated ethereal password
                },
            });
            console.log(3);
            // send mail with defined transport object
            await transporter.sendMail({
                from: 'n19dccn196@student.ptithcm.edu.vn', // sender address
                to: `${account.mail}`, // list of receivers
                subject: 'FORGOT PASSWORD', // Subject line
                text: 'FORGOT PASSWORD', // plain text body
                html: `<p>Mã xác nhận của bạn là: ${randomID}</p>`, // html body
            });

            return res.status(200).json({
                isExist: true,
                isSuccess: true,
                message: `Mã xác minh đã được gửi về email: ${account.mail}. Vui lòng kiểm tra hòm thư!`,
            });
        }
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
        });
    }
};

const verify = async (req, res, next) => {
    const { verifyID } = req.body;
    const mail = req.account.mail;
    const account = await Account.findOne({
        where: {
            forgot: verifyID,
            mail,
        },
        raw: true,
    });
    if (account) {
        res.status(200).json({
            message: `Mã xác nhận chính xác!`,
            isSuccess: true,
        });
    } else {
        res.status(400).json({
            message: `Mã xác nhận không chính xác!`,
            isSuccess: false,
        });
    }
};

const accessForgotPassword = async (req, res, next) => {
    const { password, repeatPassword } = req.body;
    const mail = req.account.mail;
    if (password != repeatPassword) {
        res.status(400).json({
            message: `Mật khẩu lặp lại không chính xác!`,
            isSuccess: false,
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        //mã hoá salt + password
        const hashPassword = bcrypt.hashSync(password, salt);
        try {
            const accountUpdate = await Account.findOne({
                where: {
                    mail,
                },
            });
            accountUpdate.password = hashPassword;
            accountUpdate.forgot = 0;

            await accountUpdate.save();
            res.status(200).json({
                message: `Lấy lại mật khẩu thành công!`,
                isSuccess: true,
            });
        } catch (error) {
            res.status(500).json({
                message: `Lấy lại mật khẩu thất bại!`,
                isSuccess: false,
            });
        }
    }
};

module.exports = {
    // getDetailTaiKhoan,
    login,
    refreshToken,
    logout,
    createAccountForCustomer,
    changePassword,
    forgotPassword,
    verify,
    accessForgotPassword,
};
