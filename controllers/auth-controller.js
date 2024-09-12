const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const db = require("../models/db");

exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;
  try {
    // validation
    if (!(username && password && confirmPassword && email)) {
      return next(new Error("กรุณากรอกข้อมูลให้ครบ"));
    }
    if (confirmPassword !== password) {
      throw new Error("Confirm password does not match");
    }

    // Check if email is already used
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new Error("อีเมลถูกใช้ไปแล้ว"));
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    const data = {
      username,
      password: hashedPassword,
      email
    };

    const rs = await db.user.create({ data });
    console.log(rs);

    res.json({ msg: 'Register successful' });
  } catch (err) {
    next(err);
  }
};



exports.login = async (req, res, next) => {
  const { username, password } = req.body
  try {
    // validation
    if (!(username.trim() && password.trim())) {
      throw new Error('username or password must not blank')
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where: { username } })
    // check password
    const pwOk = await bcrypt.compare(password, user.password)
    if (!pwOk) {
      throw new Error('invalid login')
    }
    // issue jwt token 
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    // console.log(token)
    res.json({ token: token })
  } catch (err) {
    next(err)
  }
};

exports.getme = (req, res, next) => {
  res.json(req.user)
}

exports.updateUser = async (req, res, next) => {
  const { username, newPassword, confirmPassword, oldPassword, email } = req.body;
  const { id } = req.params;

  try {
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await db.user.findUnique({ where: { id: +id } });
    if (!user) {
      throw new Error("User not found");
    }

    // ตรวจสอบว่ามีการเปลี่ยนรหัสผ่านใหม่หรือไม่
    if (newPassword || confirmPassword) {
      // ตรวจสอบว่ารหัสผ่านใหม่และรหัสผ่านที่ยืนยันตรงกันหรือไม่
      if (newPassword !== confirmPassword) {
        throw new Error("รหัสผ่านไม่ตรงกัน");
      }

      // ตรวจสอบว่ารหัสผ่านเก่าถูกต้องหรือไม่
      const pwOk = await bcrypt.compare(oldPassword, user.password);
      if (!pwOk) {
        throw new Error("รหัสผ่านไม่ถูกต้อง");
      }

      // แปลงรหัสผ่านใหม่เป็น bcrypt hash
      user.password = await bcrypt.hash(newPassword, 8);
    }

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const rs = await db.user.update({
      data: {
        password: user.password,
        username,
        email
      },
      where: { id: +id },
    });

    res.status(200).json({ msg: "Update ok", result: rs });
  } catch (err) {
    next(err);
  }
};

const { PrismaClient } = require('@prisma/client');
const cloudUpload = require("../utils/clouduploads");
const prisma = new PrismaClient();
exports.getPro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = await prisma.games.findFirst({
      where: {
        id: Number(id)
      }
    })
    if (!productData) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ค้นหา" });
    }
    res.json(productData);
    console.log(productData)
  } catch (error) {
    next(error);


  }

};


exports.order = async (req, res, next) => {
  try {
    const { user_gameId, point_id, gameId, email } = req.body;

    // Validation
    if (!(user_gameId && point_id && gameId )) {
      return next(new Error("กรุณากรอกข้อมูลให้ครบถ้วน"));
    }

    const order = await db.order.create({
      data: {
        user_gameId,
        status: "รอดำเนินการ",
        email,
        games: {
          connect: {
            id: Number(gameId)
          }
        },
        user: {
          connect: {
            id: req.user.id
          }
        },
        point: {
          connect: {
            id: Number(point_id) // Connect to an existing point by its ID
          }
        }
      }
    });
    
    res.json({ msg: "Order successfully created", order });
  } catch (error) {
    console.error(error);
    next(error);
  }
};





exports.payment = async (req, res, next) => {
  try {
    // Upload images to cloud and get URLs
    const imagePromise = req.files.map((file) => {
      return cloudUpload(file.path);
    });
    const imageUrlArray = await Promise.all(imagePromise);

    // Extract data from request body
    const { pay_img, pay_price, pay_time } = req.body;
    const userId = req.user.id; // Assuming you can access userId from req.user

    // Find orderId based on userId
    const findOrder = await db.order.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (!findOrder) {
      throw new Error("ไม่พบคำสั่งซื้อสำหรับผู้ใช้นี้");
    }

    // ให้ค้นหาข้อมูลราคาโดยใช้ ID ของราคาที่เกี่ยวข้องกับคำสั่งซื้อนี้
    const findPrice = await db.point.findUnique({
      where: {
        id: findOrder.pointId // ใช้ ID ของราคาที่เกี่ยวข้องกับคำสั่งซื้อ
      }
    });

    // Create payment record with order connection
    const payment = await db.payment.create({
      data: {
        pay_img: imageUrlArray[0],
        pay_price: findPrice.price, // เรียกใช้ findPrice และดึงราคาจากนั้นเก็บใน pay_price
        pay_time: new Date(pay_time),
        order: {
          connect: {
            id: findOrder.id
          }
        },

      }
    });

    // Response
    res.json({ msg: "Update ok", payment });
    console.log(payment); // Log the created payment object

  } catch (err) {
    next(err);
  }
};




exports.orderdetail = async (req, res, next) => {
  try {
    const order = await db.order.findFirst({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        games: true,
        Payment: true
      },
    })
    res.json(order)
  } catch (err) {
    next(err)
  }
}

///////////////////////
exports.getOrderbyUser = async (req, res, next) => {
  try {
    const getOrder = await db.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        Payment: true,
      },
    });

    res.json(getOrder);
  } catch (error) {
    next(error);
  }
};

exports.getProductBySearch = async (req, res, next) => {
  try {
    // รับคำค้นหาจาก query parameters ที่มาจากผู้ใช้
    const searchTerm = req.query.params;

    // ค้นหาผู้ใช้โดยใช้ชื่อที่ตรงกับคำค้นหาที่รับเข้ามา
    const product = await db.games.findMany({
      where: {
        game_name: {
          contains: searchTerm, // ใช้ contains operator เพื่อค้นหาชื่อที่มีคำค้นหาอยู่ในชื่อสินค้า
        },
      },
    });

    // ส่งข้อมูลผู้ใช้ที่ค้นหาได้กลับเป็น JSON
    res.json({ product });
  } catch (err) {
    // ถ้าเกิดข้อผิดพลาดในการค้นหา ส่งต่อไปยัง middleware ข้อผิดพลาดถัดไป
    next(err);
  }
};



exports.getGameByType = async (req, res, next) => {
  try {
    const gametypeId = req.params.gametypeId;
    const books = await db.games.findMany({
      where: { gametypeId: Number(gametypeId) }, // แปลง protypeId เป็น Integer ก่อนค้นหา
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
};