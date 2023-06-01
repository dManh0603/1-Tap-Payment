const express = require('express')
const transactionController = require('../controllers/TransactionController')
const authenticate = require('../middlewares/Authentication')
const adminAuthenticate = require('../middlewares/AdminAuthentication')

const router = express.Router()

router.post('/create',authenticate, transactionController.create)
router.get('/fetchMonthly', adminAuthenticate, transactionController.fetchMonthly)


module.exports = router