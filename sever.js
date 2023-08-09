const express = require('express');
const { sequelize } = require('./models');
const { rootRouter } = require('./routers');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const port = 3007;
const app = express();
const cors = require('cors');
const cron = require('cron');
const cloudinary = require('cloudinary').v2;
const Multer = require('multer');
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
const { Invoice, Invoice_product } = require('./models');
const { QueryTypes, Op, where, STRING } = require('sequelize');

const job = new cron.CronJob('0 */30 * * * *', async () => {
    // Mã thực hiện xoá các invoice không được thanh toán mỗi 30 phút
    await deleteUnpaidInvoices();
});

cloudinary.config({
    cloud_name: 'dgsumh8ih',
    api_key: '726416339718441',
    api_secret: 'n9z2-8LwGN8MPhbDadWYuMGN78U',
});
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
    });
    return res;
}
const storage = new Multer.memoryStorage();
const upload = Multer({
    storage,
});
app.post('/upload', upload.single('my_file'), async (req, res) => {
    try {
        console.log(req.file);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        const cldRes = await handleUpload(dataURI);
        res.status(200).json({
            isSuccess: true,
            url: cldRes.url,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ isSuccess: false, message: error.message });
    }
});

async function deleteUnpaidInvoices() {
    try {
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        let invoices = await Invoice.findAll({
            where: {
                status: 0,
                date: {
                    [Op.lt]: moment().subtract(30, 'minutes'),
                },
            },
            raw: true,
        });

        for (let invoice of invoices) {
            if (!invoice) {
                throw new Error('Invoice not found');
            }
            //console.log(invoice)
            await Invoice_product.destroy({
                where: {
                    idInvoice: invoice.idInvoice, // Sử dụng trường id hoặc trường khác để xác định hóa đơn cần xóa
                },
            });
            await Invoice.destroy({
                where: {
                    idInvoice: invoice.idInvoice, // Sử dụng trường id hoặc trường khác để xác định hóa đơn cần xóa
                },
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
});
