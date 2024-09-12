const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const authController = require('../controllers/auth-controller')
const  productcontroller= require('../controllers/todo-controller')
const upload = require('../middlewares/uploads')

router.get('/me', authenticate, authController.getme) 
router.get('/product', productcontroller.getmenutems ) 
router.get('/getGameById/:id', productcontroller.getGameById ) 
router.get('/type', productcontroller.getType ) 
router.get('/orderdetail/:id', authenticate,authController.orderdetail ) 
router.get('/getproduct/:id',  authController.getPro )
router.get('/getOrderbyUser',authenticate,authController.getOrderbyUser)
router.get('/getProductBySearch',  authController.getProductBySearch)
router.get('/typeId/:gametypeId',  authController.getGameByType)

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/payment', upload.array("image",1),authenticate, authController.payment)////
router.post('/order',authenticate,authController.order)

// router.put('/:id', authenticate, authController.updateUser) 
router.put('/:id', authenticate, authController.updateUser)


module.exports = router