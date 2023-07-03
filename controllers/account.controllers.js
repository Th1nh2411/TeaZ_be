const { Account, User, Staff} = require("../models");
const db = require("../models/index");
const moment = require('moment-timezone'); // require

const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const createCustomerWithTransaction = async (phone, password, name) => {
    //console.log('test1')
    const t = await db.sequelize.transaction(); // Bắt đầu transaction
    
    let isSuccess
    try {
        //console.log('test2')
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        //console.log('test3')
        const newAccount = await Account.create({
            phone,
            role: 0,
            password: hashPassword,

        }, { transaction: t });
        //console.log('test4')
        const newCustomer = await User.create({
            idAcc: newAccount.idAcc,
            name,
            isShare: 1,

        }, { transaction: t });

        //console.log('test5')
        //console.log('test3')


        await t.commit(); // Lưu thay đổi và kết thúc transaction
        isSuccess = true
    } catch (error) {
        isSuccess = false
        await t.rollback(); // Hoàn tác các thay đổi và hủy bỏ transaction
        
    }

    return isSuccess
}

const createAccountForCustomer = async (req, res) => {
    
   
    try {
        const { phone, password, name } = req.body;
        if (phone === '' || password === '' || name === '') {
            return res.status(400).json({ isSuccess: false, mes: 'addStaff1' });
        }
        if (isNaN(phone) || password === undefined || name === undefined) {
            return res.status(400).json({ isSuccess: false, mes: 'addStaff2' });
        }
        //tạo ra một chuỗi ngẫu nhiên
        let isSuccess = await createCustomerWithTransaction(phone,password, name)
       
        res.status(200).json({

            isSuccess
        });

    } catch (error) {
        res.status(500).json({
            isExist: true,
            isSuccess:false
        });
    }
};
//tam thoi chua co

const loginAdmin = async (req, res) => {

};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const account = req.account
        //console.log(account)
        const isAuth = bcrypt.compareSync(password, account.password);
        
        if (isAuth) {
            let customer
            if(account.role==0){{
                customer = await User.findOne({
                    where: {
                        idAcc: account.idAcc,
                    },
                });
            }}
            else{
                customer = await Staff.findOne({
                    where: {
                        idAcc: account.idAcc,
                    },
                });
            }
            
            const token = jwt.sign({ phone: account.phone }, "hehehe", {
                expiresIn: 30*60 * 60 * 60,
            });
            customer.dataValues.phone = phone
            customer.dataValues.role = account.role
            
            res
                .status(200)
                .json({
                    customer,
                    isSuccess : true,
                    
                    token,
                    
                    expireTime: 30*60 * 60 * 60,
                });
        } else {
            return res.status(401).json({ isSuccess:false});
        }
    } catch (error) {
        return res.status(500).json({ isSuccess:false});
    }
   
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, repeatPassword } = req.body;
    console.log("test")
    console.log(req.mail)
    try {
        const accountUpdate = await Account.findOne({
            where: {
                mail: req.mail,
            },
        });
        const isAuth = bcrypt.compareSync(oldPassword, accountUpdate.password);
        if (isAuth) {
            if (newPassword == repeatPassword) {
                if (newPassword == oldPassword) {
                    res.status(400).json({
                        status: true,
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
                        isSuccess: true
                    });
                }
            } else {
                res.status(400).json({
                    status: true,
                    isSuccess:false
                });
            }
        } else {
            res.status(400).json({
                status: false,
                isSuccess:false
            });
        }
    } catch (error) {
        res.status(500).json({
            status: true,
            isSuccess:false
        });
    }
};

const logout = async (req, res, next) => {
    res.removeHeader("access_token");

    res.status(200).json({ isSuccess:true});
};

const forgotPassword = async (req, res) => {
    const { mail } = req.body;
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
                isSuccess:false
            });
        } else {
            
            await Account.sequelize.query(
                "UPDATE accounts SET forgot = :randomID WHERE mail = :mail",
                {
                    type: QueryTypes.UPDATE,
                    replacements: {
                        randomID: randomID,
                        mail: mail,
                    },
                }
            );
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "n19dccn107@student.ptithcm.edu.vn", // generated ethereal user
                    pass: "bqztpfkmmbpzmdxl", // generated ethereal password
                },
            });
            // send mail with defined transport object
            await transporter.sendMail({
                from: "n19dccn107@student.ptithcm.edu.vn", // sender address
                to: `${mail}`, // list of receivers
                subject: "FORGOT PASSWORD", // Subject line
                text: "FORGOT PASSWORD", // plain text body
                html: `Mã xác nhận của bạn là: ${randomID}`, // html body
            });

            return res.status(200).json({
                isExist: true,
                isSuccess: true,
                message: `Mã xác minh đã được gửi về email: ${mail} vui lòng kiểm tra hòm thư!`,
            });
        }
    } catch (error) {
        res.status(500).json({
            isExist: true,
            isSuccess:false
        });
    }
};



const verify = async (req, res, next) => {
    const { verifyID, mail } = req.body;
    const account = await Account.findOne({
        where: {
            forgot: verifyID,
            mail
        },
        raw: true,
    });
    if (account) {
        res.status(200).json({
            message: `Mã xác nhận chính xác!`,
            isSuccess: true
        });
    } else {
        res.status(400).json({
            message: `Mã xác nhận không chính xác!`,
            isSuccess: false
        });
    }
};

const accessForgotPassword = async (req, res, next) => {
    const { mail, password, repeatPassword } = req.body;
    if (password != repeatPassword) {
        res.status(400).json({
            message: `Mật khẩu lặp lại không chính xác!`,
            isSuccess:false
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
                isSuccess:true
            });
        } catch (error) {
            res.status(500).json({
                message: `Lấy lại mật khẩu thất bại!`,
                isSuccess:false
            });
        }
    }
};




module.exports = {
    // getDetailTaiKhoan,
    login, logout, createAccountForCustomer, changePassword, forgotPassword, loginAdmin, verify, accessForgotPassword
};