const express = require('express')
const userController = require('../controllers/UserController')

const router = express.Router()

router.get('/:id', userController.findUser)

router.post('/login', userController.login)
router.post('/signup', userController.signup)


module.exports = router