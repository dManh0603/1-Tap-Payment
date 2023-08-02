const Message = require('../models/MessageModel')
const Chat = require('../models/ChatModel')
const User = require('../models/UserModel');

class MessageController {

  sendMessage = async (req, res, next) => {
    try {
      const { content, chatId } = req.body;
      if (!content || !chatId) {
        res.status(400);
        throw new Error('Bad request');
      }

      const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
      }

      let message = await Message.create(newMessage);
      message = await message.populate('sender', 'name avt');
      message = await message.populate('chat');
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'name avt email',
      })

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      res.status(200).json(message);
    } catch (error) {
      next(error)
    }
  }

  fetchMessages = async (req, res, next) => {
    try {
      const messages = await Message.find({ chat: req.params.id })
        .populate('sender', 'name avt email')
        .populate('chat')

      res.status(200).json(messages);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new MessageController;