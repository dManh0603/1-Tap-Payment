const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const Message = require('../models/MessageModel')
class ChatController {
  async accessChat(req, res, next) {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400);
        throw new Error('Bad request');
      }

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

      res.status(200).send(chats[0]);
    } catch (error) {
      next(error)
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
      next(error)
    }
  }

  // [GET] /api/chat/unseen
  async fetchUnseenChats(req, res, next) {
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
        return res.status(200).json([]);
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

      return res.status(200).json(transformedChats);
    } catch (error) {
      next(error)
    }
  }

  // [PUT] /api/chat/seen
  async seenChat(req, res, next) {

    try {
      const { chatId } = req.body;
      // Update all messages in the chat to seen
      await Message.updateMany(
        { chat: chatId },
        { seen: true }
      );

      res.status(200).json({ message: 'Messages updated to seen' });
    } catch (error) {
      next(error)
    }
  }
}


module.exports = new ChatController;
