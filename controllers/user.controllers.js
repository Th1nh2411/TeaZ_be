const { Account } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        const account = req.account;
        return res.status(200).json({ info: { ...account.dataValues, name: user.name }, isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
const editUserInfo = async (req, res) => {
    try {
        const { name, mail, phone } = req.body;
        const user = req.user;
        const account = req.account;
        const existMail = await Account.findOne({
            where: {
                mail: {
                    [Op.and]: {
                        [Op.ne]: account.mail,
                        [Op.eq]: mail,
                    },
                },
            },
        });
        const existPhone = await Account.findOne({
            where: {
                phone: {
                    [Op.and]: {
                        [Op.ne]: account.phone,
                        [Op.eq]: phone,
                    },
                },
            },
        });
        if (existMail) return res.status(409).send({ isSuccess: false, message: 'Mail này đã có tài khoản đăng kí' });
        if (existPhone)
            return res.status(409).send({ isSuccess: false, message: 'Số điện thoại này đã có tài khoản đăng kí' });
        if (name) {
            user.name = name;
        }

        if (phone) {
            account.phone = phone;
        }

        if (mail) {
            account.mail = mail;
        }
        await account.save();
        await user.save();
        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
module.exports = {
    // getDetailTaiKhoan,
    getUserInfo,
    editUserInfo,
};
