const express = require('express')
const transactionController = require('../controllers/TransactionController')
const authenticate = require('../middlewares/Authentication')
const adminAuthenticate = require('../middlewares/AdminAuthentication')

const router = express.Router()

router.post('/paypal/create', authenticate, transactionController.paypalCreate)
router.post('/zalopay/create', authenticate, transactionController.zalopayCreate)
router.post('/zalopay/query', authenticate, transactionController.zalopayQuery)
router.get('/fetchMonthly', adminAuthenticate, transactionController.fetchMonthly)
router.get('/', authenticate, transactionController.getUserTransactions)

module.exports = router