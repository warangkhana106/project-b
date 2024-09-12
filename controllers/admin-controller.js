const db = require("../models/db");
require("dotenv").config();

exports.getUser = async (req, res, next) => {
  try {
    const user = await db.user.findMany();
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.protype = async (req, res, next) => {
  const { name } = req.body;
  const data = { gametype_name: name };
  try {
    if (req.body === "") {
      res.json({ msg: "กรุณากรอกประเภทเกมส์" });
    } else {
      const rs = await db.TypeGames.create({
        data: data,
        // data: {...data, userId: req.user.id}
      });
      res.json({ msg: "Create Ok", result: rs });
      // res.json(rs)
    }
  } catch (err) {
    next(err);
  }
};

exports.createproduct = async (req, res, next) => {
  try {
    const { name, img } = req.body;
    console.log(req.body);
    // Validation
    // if (!(name && price && unit && decription && url && productType_id)) {
    //   return next(new Error("Please provide all required fields"));

    // }
    // if (!(name && price && point && img && gametypeId)) {
    //   return res.status(400).json({ error: "Please provide all required fields" });
    // }
    const { gametypeId } = req.body;
    const product = await db.games.create({
      data: {
        game_name: name,
        img,
        // gametypeId:Number(gametypeId)
        gametype_name: {
          connect: { id: Number(gametypeId) },
        },
      },
    });

    res.json({ msg: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

exports.getProList = async (req, res, next) => {
  try {
    const getP = await db.games.findMany({
      include: {
        gametype_name: true,
      },
    });
    res.json({ getP });
  } catch (err) {
    next(err);
  }
};

exports.createPoint = async (req, res, next) => {
  try {
    const { price, point } = req.body;
    console.log(req.body);
    // Validation
    // if (!(name && price && unit && decription && url && productType_id)) {
    //   return next(new Error("Please provide all required fields"));

    // }
    // if (!(name && price && point && img && gametypeId)) {
    //   return res.status(400).json({ error: "Please provide all required fields" });
    // }
    const { gameId } = req.body;

    const createPoint = await db.point.create({
      data: {
        price: Number(price),
        point: Number(point),
        // gametypeId:Number(gametypeId)
        game: {
          connect: { id: Number(gameId) },
        },
      },
    });

    res.json({ msg: "Point created successfully", createPoint });
  } catch (error) {
    next(error);
  }
};

exports.getType = async (req, res, next) => {
  const getG = await db.typeGames.findMany();
  res.json({ getG });
};
exports.getGame = async (req, res, next) => {
  const getGame = await db.games.findMany();
  res.json({ getGame });
};

exports.deleteGame = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rs = await db.games.delete({ where: { id: +id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};
exports.deletetypegames = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rs = await db.typeGames.delete({ where: { id: parseInt(id) } });
    res.json({ msg: "Delete OK", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  // validate req.params + req.body
  const { id } = req.params;
  const { game_name, img } = req.body;
  try {
    const rs = await db.games.update({
      data: {
        game_name,
        img,
        
      },
      where: { id: Number(id) },
    });
    res.json({ msg: "Update ok", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.updateType = async (req, res, next) => {
  // validate req.params + req.body
  const { id } = req.params;
  const { gametype_name } = req.body;
  try {
    const rs = await db.typeGames.update({
      data: {
        gametype_name,
      },
      where: { id: Number(id) },
    });
    res.json({ msg: "Update ok", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.typegames = async (req, res, next) => {
  try {
    const typegames = await db.typeGames.findMany();
    res.json({ typegames });
  } catch (err) {
    next(err);
  }
};

exports.getGameByPoint = async (req, res, next) => {
  try {
    const get = await db.point.findMany({
      include: {
        game: true,
      },
    });
    res.json({ get });
  } catch (err) {
    next(err);
  }
};

exports.getGamePoints = async (req, res, next) => {
  try {
    const get = await db.games.findMany({
      include: {
        Point: true,
      },
    });
    res.json({ get });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const getOrder = await db.order.findMany({
      include: {
        Payment: true,
      },
      orderBy:{
        id: 'desc'
      }
    });

    res.json(getOrder);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const id = req.params.id;
  const newStatus = req.body.status;
  try {
    const Int = +id;
    const rs = await db.order.update({
      data: { status: newStatus },
      where: { id: Int },
    });
    res.json({ msg: "Update ok", result: rs }); // ส่ง response กลับให้ frontend
  } catch (err) {
    next(err);
  }
};
exports.updateGamePoint = async (req, res, next) => {
  const { pointId } = req.params; // Destructure pointId from req.params
  const { point, price } = req.body; // Destructure point and price from req.body

  try {
    const Int = +pointId; // Convert pointId to a number
    const pointNumber = Number(point); // Convert point to a number
    const priceNumber = Number(price); // Convert price to a number

    // Ensure conversions are successful and valid numbers
    if (isNaN(pointNumber) || isNaN(priceNumber)) {
      return res.status(400).json({ msg: "Invalid point or price values" });
    }

    const rs = await db.point.update({
      data: {
        point: pointNumber,
        price: priceNumber,
      },
      where: {
        id: Int,
      },
    });
    res.json({ msg: "Update successful", result: rs }); // Send response back to frontend
  } catch (err) {
    next(err);
  }
};

exports.deleteGamePoint = async (req, res, next) => {
  const pointId = req.params.pointId;
  try {
    const Int = +pointId;
    await db.point.delete({
      where: { id: Int },
    });
    res.json({ msg: "Point deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rs = await db.games.delete({ where: { id: +id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const paymentId = req.params.paymentId;
  const id = parseInt(paymentId, 10);

  try {
    const rs = await db.order.delete({
      where: { id: id },
    });

    res.json({ msg: "delete successful", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  const id = req.params.id;
  const newRole = req.body.role; // รับ role จาก body
  try {
    const Int = +id;
    const rs = await db.user.update({
      data: { role: newRole },
      where: { id: Int },
    });
    res.json({ msg: "Update ok", result: rs }); // ส่ง response กลับให้ frontend
  } catch (err) {
    next(err);
  }
};

const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createInvoice } = require("./invoiceGenerator");

exports.generateReceipt = async (req, res, next) => {
  const orderId = parseInt(req.params.orderId); // แปลง orderId เป็นจำนวนเต็ม

  try {
    // ดึงข้อมูลคำสั่งซื้อจากฐานข้อมูลพร้อมกับข้อมูลที่เกี่ยวข้อง
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        user: true, // ข้อมูลผู้ใช้
        games: true, // ข้อมูลเกม
        point: true, // ข้อมูลพ้อย (ถ้าต้องการข้อมูลจากตารางนี้)
        Payment: true, // ข้อมูลการชำระเงิน
      },
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // สร้างข้อมูลใบเสร็จจากข้อมูลคำสั่งซื้อ
    const invoiceData = {
      customerName: order.user.username, // ใช้ชื่อผู้ใช้จากคำสั่งซื้อ
      customerEmail: order.email, // ใช้อีเมลของผู้ใช้จากคำสั่งซื้อ
      orderId: order.id,
      orderDate: new Date().toLocaleString(),
      game: [
        {
          name: order.games.game_name, // ใช้ชื่อเกมจากตาราง games
          quantity: 1,
          point: `${order.point ? order.point.point : ""} `,
          price: `${order.point ? order.point.price : "฿"} `,
        },
      ],
      total: ` ${order.point ? order.point.price : "฿"}`, // คำนวณรวมราคา (ตรวจสอบว่ามีข้อมูลหรือไม่)
    };
    const invoiceDir = path.join(__dirname, "invoices")
    const filePath = path.join(__dirname, "invoices", `invoice_${orderId}.pdf`);
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir);
    }
    createInvoice(invoiceData, filePath);

    // const filePath = path.join(__dirname, "invoices", invoice_${orderId}.pdf);
    // if (!fs.existsSync(path.join(__dirname, "invoices"))) {
    //   fs.mkdirSync(path.join(__dirname, "invoices"));
    // }
    // createInvoice(invoiceData, filePath);

    res.json({
      msg: "Invoice generated",
      filePath: `http://localhost:8889/invoices/invoice_${orderId}.pdf `,
    });
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect(); // ปิดการเชื่อมต่อกับฐานข้อมูล
  }
};
