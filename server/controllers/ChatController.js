const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

class ChatController {
  async accessChat(req, res, next) {
    const { userId } = req.body;

    if (!userId) {
      throw { statusCode: 400, message: 'No user id was provided!' }
    }

    try {
      let chats = await Chat.find({
        users: { $all: [req.user._id, userId] }
      })
        .populate('users', '-password')
        .populate('latestMessage')
        .populate({
          path: 'latestMessage.sender',
          select: 'name avt email'
        });

      if (chats.length === 0) {
        const chatData = {
          chatname: 'sender',
          users: [req.user._id, userId],
        };
        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findById(createdChat)
          .populate('users', '-password')
          .populate({
            path: 'latestMessage.sender',
            select: 'name avt email'
          });

        chats = [fullChat];
      }

      res.send(chats[0]);
    } catch (error) {
      console.error(error);
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    }
  }

  async fetchChats(req, res, next) {
    try {
      const results = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } }
      })

        .populate('users', '-password')
        .populate({
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: 'name avt email',
          },
        })
        .sort({ updatedAt: -1 })
        .exec();

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

}


module.exports = new ChatController;
