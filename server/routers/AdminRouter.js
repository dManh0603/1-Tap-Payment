const express = require('express')
const adminController = require('../controllers/AdminController');
const adminAuthenticate = require('../middlewares/AdminAuthentication');

const router = express.Router()

router.post('/login', adminController.login)
router.get('/dashboard',adminAuthenticate, adminController.dashboard)
router.get('/transactions',adminAuthenticate, adminController.transactions)
router.get('/transaction/:id',adminAuthenticate, adminController.transaction_details)


module.exports = router