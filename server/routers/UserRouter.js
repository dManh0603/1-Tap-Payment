const express = require('express')
const userController = require('../controllers/UserController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.get('/search/:keyword', authenticate, userController.searchUser)
router.get('/transaction/:date', authenticate, userController.getMonthlyTransaction)
router.get('/', authenticate, userController.getUser)

router.post('/login', userController.login)
router.post('/signup', userController.signup)


module.exports = router