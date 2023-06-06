const express = require('express')
const authenticate = require('../middlewares/Authentication')
const chatController = require('../controllers/ChatController')

const router = express.Router()

router.get('/',authenticate, chatController.fetchChats)

router.post('/',authenticate, chatController.accessChat)

module.exports = router