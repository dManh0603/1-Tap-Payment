const express = require('express')
const authenticate = require('../middlewares/Authentication')
const adminController = require('../controllers/AdminController')

const router = express.Router()

router.get('/', adminController.index);


module.exports = router