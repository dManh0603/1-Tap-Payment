const express = require('express')
const balanceController = require('../controllers/BalanceController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.put('/deposit',authenticate, balanceController.deposit)
// router.put('/refund', userController.signup)
// router.post('/pay', userController.signup)


module.exports = router