const express = require('express')
const adminController = require('../controllers/AdminController');
const adminAuthenticate = require('../middlewares/AdminAuthentication');

const router = express.Router()

router.post('/login', adminController.login)

router.put('/user/:id', adminAuthenticate, adminController.updateUserDetails)

router.get('/dashboard',adminAuthenticate, adminController.getDashboard)
router.get('/activity/monthly', adminAuthenticate, adminController.getMonthlyActivity)
router.get('/activity',adminAuthenticate, adminController.getUserActivities)
router.get('/transactions',adminAuthenticate, adminController.getTransactions)
router.get('/transaction/:id',adminAuthenticate, adminController.getTransactionDetails)
router.get('/users', adminAuthenticate, adminController.getUsers)
router.get('/user/:id', adminAuthenticate, adminController.getUserDetails)
router.get('/config', adminAuthenticate, adminController.getConfig)
router.put('/config', adminAuthenticate, adminController.updateConfig)

module.exports = router