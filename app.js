require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // เพิ่มการนำเข้าโมดูล path
const notFound = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authRoute = require('./routes/auth-route');
const todoRoute = require('./routes/todo-route');
const adminRoute = require('./routes/admin-route');
const { createInvoice } = require('./controllers/invoiceGenerator');

const app = express();

app.use(cors());
app.use(express.json());

// service
app.use('/auth', authRoute);
app.use('/todos', todoRoute);
app.use('/admin', adminRoute);

app.use('/invoices', express.static(path.join(__dirname, './controllers/invoices/')));

// notFound
app.use(notFound);

// error
app.use(errorMiddleware);

// เสิร์ฟไฟล์ในโฟลเดอร์ invoices

let port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server on Port :', port));
