const express = require('express')
const adminController = require('../controllers/AdminController');
const adminAuthenticate = require('../middlewares/AdminAuthentication');

const router = express.Router()

router.post('/',adminAuthenticate, adminController.dashboard);

// router.get('/dashboard',authenticate, adminController.dashboard)
router.get('/', adminController.index);

module.exports = router