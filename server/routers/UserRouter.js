const express = require('express')
const userController = require('../controllers/UserController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.get('/',authenticate, userController.findUser)

router.post('/login', userController.login)
router.post('/signup', userController.signup)


module.exports = router