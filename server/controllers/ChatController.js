const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const Message = require('../models/MessageModel')
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
        .populate('users', '-password -card_uid -card_balance')
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
          .populate('users', '-password -card_uid -card_balance')
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

  // [GET] /api/chat/unseen
  async fetchUnseenChats(req, res) {
    try {
      const userId = req.user._id;

      // Find all chats where the user is a participant and the latest message is unseen
      const unseenChats = await Chat.find({
        users: userId,
        latestMessage: { $exists: true },
      }).populate({
        path: 'users',
        select: '_id name email', // Include _id, name, and email fields for users
      }).populate({
        path: 'latestMessage',
        match: {
          seen: false,
          sender: { $ne: userId }, // Exclude the messages where the sender is the user
        },
        populate: {
          path: 'sender',
          select: '_id name',
        },
      });

      // Check if there are any messages with seen set to false
      const hasUnseenMessages = unseenChats.some(chat => chat.latestMessage && chat.latestMessage.seen === false);

      if (!hasUnseenMessages) {
        // No messages with seen set to false, return an empty array
        return res.json([]);
      }

      // Transform the response to the desired structure
      const transformedChats = unseenChats.map(chat => {
        const { _id, users, latestMessage } = chat;
        if (!latestMessage) {
          return;
        }
        return {
          chat: { _id, users },
          __v: latestMessage.__v,
          latestMessage: {
            sender: latestMessage.sender,
            _id: latestMessage._id,
            content: latestMessage.content,
            seen: latestMessage.seen,
          }

        };
      }).filter(chat => chat !== null);

      return res.json(transformedChats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // [PUT] /api/chat/seen
  async seenChat(req, res) {

    try {
      const { chatId } = req.body;
      console.log(chatId)
      // Update all messages in the chat to seen
      const result = await Message.updateMany(
        { chat: chatId },
        { seen: true }
      );
      console.log('update success')
      res.json({ message: 'Messages updated to seen' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


module.exports = new ChatController;
