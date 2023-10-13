const Router = require('express')
const router = new Router()
const todoController = require('../controllers/todoController')
const { validateTodoPost  } = require('../middleware/validateMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/' ,authMiddleware  ,todoController.getTodo)
router.post('/',authMiddleware , validateTodoPost ,todoController.postTodo)
router.put('/:id',authMiddleware  ,todoController.putTodo)
router.delete('/:id',authMiddleware  ,todoController.deleteTodo)

module.exports = router


// http://192.168.7.64:5000/user/register

// user_name:
// phone:
// email:
// password:

// http://192.168.0.106:5000/user/login
// email:
// password:


// http://192.168.0.106:5000/todo

// http://192.168.0.106:5000/todo/ + id

// JSON.stringify(
// {
//   text:value
// }
// )

// authorization


