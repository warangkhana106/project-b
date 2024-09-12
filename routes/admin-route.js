const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
// const authentiateAdmin = require ('../middlewares/authenticateAdmin')
const authentiate = require('../middlewares/authenticate')

router.get('/user', adminController.getUser)
router.get('/getGame',adminController.getGame)
router.get('/getprolist',adminController.getProList)
router.get("/getType", adminController.getType)
router.get('/getGameByPoint', adminController.getGameByPoint)
router.get('/typegames',adminController.typegames)
router.get('/getOrder',adminController.getOrder)
router.get('/getGamePoints', adminController.getGamePoints)

router.post('/typegames',authentiate,adminController.protype)
router.post('/createproduct',authentiate,adminController.createproduct)
router.post('/cratepoint',adminController.createPoint)////
router.post('/generateReceipt/:orderId',authentiate,adminController.generateReceipt)/////

router.patch('/updateproduct/:id', adminController.updateProduct) ////
router.patch('/updateType/:id', adminController.updateType) ////
router.patch('/updateGamePoint/:pointId',adminController.updateGamePoint)/////

router.put('/updateStatus/:id',authentiate,adminController.updateStatus)/////
router.put('/upadteRole/:id',adminController.updateRole)/////

router.delete("/deletegame/:id", authentiate,adminController.deleteGame) 
router.delete("/deletetypegames/:id",authentiate,adminController.deletetypegames) 
router.delete('/deleteGamePoint/:pointId',adminController.deleteGamePoint)/////
router.delete('/deleteOrder/:paymentId',authentiate,adminController.deleteOrder)/////

module.exports = router;