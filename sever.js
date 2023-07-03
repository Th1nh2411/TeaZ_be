const express = require("express");
const {sequelize} = require("./models");
const {rootRouter} = require("./routers")
const moment = require('moment');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const path = require("path");
const port = 3007;
const app = express();
const cors = require("cors");
const cron = require('cron');
app.use(cookieParser());
app.use(cors());
//cài ứng dụng sử dụng json
app.use(express.json());
//cài static file
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

//dùng router
app.use(rootRouter);
const {Invoice, Cart } = require("./models");
const { QueryTypes, Op, where, STRING } = require("sequelize");

const { changeIngredientByInvoice } = require("./controllers/order.controllers");

const job = new cron.CronJob('0 */30 * * * *', async () => {
  // Mã thực hiện xoá các invoice không được thanh toán mỗi 30 phút
  await deleteUnpaidInvoices();
});
// const job = new cron.CronJob('*/30 * * * * *', async () => {
//   // Mã thực hiện xoá các invoice không được thanh toán mỗi 30 giây
//   await deleteUnpaidInvoices();
// });

async function deleteUnpaidInvoices() {
  try {
    const date = moment().format("YYYY-MM-DD HH:mm:ss")
    let invoices = await Invoice.findAll({
      where: {
        status: 0,
        date: {
          [Op.lt]: moment().subtract(30, 'minutes')
        }
      },
      raw: true
    });

    for (let invoice of invoices) {
      let cart = await Cart.findOne({
        where: { idCart: invoice.idCart }
      });
      let currentCart = await Cart.findOne({
        where:{ 
          idUser: cart.idUser,
          isCurrent: 1
        }
      })
      
      if (!cart) {
        throw new Error('Cart not found for invoice');
      }
      if(!currentCart){
        cart.isCurrent = 1;
        await cart.save();
      }
      

      if (!invoice) {
        throw new Error('Invoice not found');
      }
      let idShop = invoice.idShop
      let infoChange = await changeIngredientByInvoice(invoice, idShop, 1, date )
      //console.log(invoice)
      await Invoice.destroy({
        where: {
          idInvoice: invoice.idInvoice // Sử dụng trường id hoặc trường khác để xác định hóa đơn cần xóa
        }
      });
    }

    console.log('Unpaid invoices deleted successfully.');
  } catch (error) {
    console.error('Error deleting unpaid invoices:', error);
  }
}


// Bắt đầu công việc cron
job.start();

//lắng nghe sự kiện kết nối
app.listen(port, async () => {
    console.log(`App listening on http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        console.log('Kết nối thành công!.');
      } catch (error) {
        console.error('Kết nối thất bại:', error);
      }
})