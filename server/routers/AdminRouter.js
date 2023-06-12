const express = require('express')
const adminController = require('../controllers/AdminController');
const adminAuthenticate = require('../middlewares/AdminAuthentication');

const router = express.Router()

router.post('/login', adminController.login)
router.get('/dashboard',adminAuthenticate, adminController.getDashboard)
router.get('/transactions',adminAuthenticate, adminController.getTransactions)
router.get('/transaction/:id',adminAuthenticate, adminController.getTransactionDetails)
router.get('/users', adminAuthenticate, adminController.getUsers)
router.get('/user/:id', adminAuthenticate, adminController.getUserDetails)
router.put('/user/:id', adminAuthenticate, adminController.updateUserDetails)


module.exports = router