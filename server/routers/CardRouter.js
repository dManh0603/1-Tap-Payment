const express = require('express')
const userController = require('../controllers/UserController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.put('/disable', authenticate, userController.disableCard)

module.exports = router