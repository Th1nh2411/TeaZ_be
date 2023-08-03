const { Account, User } = require('../../models');
const { QueryTypes } = require('sequelize');

const authorize = (role) => async (req, res, next) => {
    try {
        //console.log(1)
        const account = req.account;
        if (role == 0) {
            if (account.dataValues.role === role) {
                const user = await User.findOne({
                    where: { idAcc: account.idAcc },
                });
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
            }
        } else {
            if (account.dataValues.role >= role) {
                const staff = await User.findOne({
                    where: { idAcc: account.idAcc },
                });
                req.staff = staff;
                next();
            } else {
                return res.status(403).json({ message: 'Bạn không có quyền sử dụng chức năng này!' });
            }
        }
    } catch (error) {
        return res.status(501).json({ error, message: 'autho' });
    }
};

module.exports = {
    authorize,
};
