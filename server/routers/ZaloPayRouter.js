const express = require('express')
const authenticate = require('../middlewares/Authentication')
const ZaloPayController = require('../controllers/ZaloPayController')

const router = express.Router()

router.post('/create', authenticate, ZaloPayController.create)


module.exports = router