const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const todoController = require('../controllers/todo-controller')

router.get('/', authenticate, todoController.getByUser)
router.get('/all-status', authenticate, todoController.getAllStatus)
router.post('/', authenticate, todoController.createTodo)
// router.post('/ordergame', authenticate, todoController.ordergame)
router.put('/:id', authenticate, todoController.updateTodo)
router.delete('/:id', authenticate, todoController.deleteTodo )
// router.get('/gameByType/:id', todoController.getGameByType )

module.exports = router