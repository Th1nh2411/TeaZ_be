const jwt = require('jsonwebtoken');
const { Account } = require('../../models');
const { Op } = require('sequelize');
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.access_token;
        if (!token) {
            return res.status(403).json({ message: 'Vui lòng đăng nhập!', isSuccess: false });
        }
        const data = jwt.verify(token, 'hehehe');

        const account = await Account.findOne({
            where: {
                [Op.or]: [{ phone: data.phone }, { mail: data.mail }],
            },
            attributes: ['idAcc', 'phone', 'mail', 'role'],
        });
        req.account = account;

        return next();
    } catch {
        return res.status(403).json({ message: 'Sai token', isSuccess: false });
    }
};

module.exports = {
    authenticate,
};
