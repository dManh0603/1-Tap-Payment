const express = require('express')
const authenticate = require('../middlewares/Authentication')
const chatController = require('../controllers/ChatController')

const router = express.Router()

router.get('/',authenticate, chatController.fetchChats)
router.get('/unseen', authenticate, chatController.fetchUnseenChats)
router.post('/',authenticate, chatController.accessChat)
router.put('/seen', authenticate, chatController.seenChat)
module.exports = router