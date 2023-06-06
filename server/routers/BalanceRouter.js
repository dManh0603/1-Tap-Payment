const express = require('express')
const balanceController = require('../controllers/BalanceController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.put('/add',authenticate, balanceController.add)
// router.put('/refund', userController.signup)
router.put('/deduct/:card_uid', balanceController.deduct)


module.exports = router