const express = require('express')
const transactionController = require('../controllers/TransactionController')
const authenticate = require('../middlewares/Authentication')

const router = express.Router()

router.post('/create',authenticate, transactionController.create)



module.exports = router