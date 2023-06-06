const express = require('express')
const adminController = require('../controllers/AdminController');
const adminAuthenticate = require('../middlewares/AdminAuthentication');

const router = express.Router()

router.post('/login', adminController.API_login)
router.get('/dashboard',adminAuthenticate, adminController.API_dashboard)


module.exports = router