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
        const { name, mail, phone, password } = req.body;
        const user = req.user;
        const account = req.account;
        const accountUpdate = await Account.findOne({
            where: {
                [Op.or]: [{ phone: phone ? phone : '' }, { mail: mail ? mail : '' }],
            },
        });

        //console.log(created)
        if (accountUpdate) {
            return res.status(409).send({ isSuccess: false, mes: 'Tài khoản đã tồn tại' });
        }
        if (name) {
            user.name = name;
        }

        if (phone) {
            account.phone = phone;
        }
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            account.password = hashPassword;
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
