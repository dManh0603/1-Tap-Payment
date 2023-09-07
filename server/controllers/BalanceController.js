const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel')
const CryptoJS = require('crypto-js');
const UserActivity = require('../models/UserActivityModel');
class BalanceController {
  async add(req, res, next) {
    try {
      const { amount, transactionId } = req.body;
      if (!amount || !transactionId) {
        res.status(400);
        throw new Error('Bad request.')
      }
      const coresponseTransaction = await Transaction.findById(transactionId);

      if (parseFloat(amount) !== coresponseTransaction.amount) {
        res.status(400);
        throw new Error('No corresponding transaction found');
      }
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { balance: parseFloat(amount) } },
        { new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }


  async deduct(req, res, next) {
    try {
      const card_uid = req.params.card_uid;
      console.log(card_uid)
      const type = req.body.type;
      if (!card_uid || !type) {
        res.status(400);
        throw new Error('Bad request');
      }

      const currentTime = new Date().getHours();

      const user = await User.findOne({ card_uid });
      if (!user) {
        res.status(404)
        throw new Error('User not found');
      }

      if (user.card_disabled === true) {
        res.status(403)
        throw new Error('Card disabled');
      }
      let amount
      if (type === 'motorbike') {
        amount = process.env.motorbikePrice ?? 3;
        if (currentTime >= 19 || currentTime <= 6) {
          amount += 2;
        }
      } else if (type === 'bicycle') {
        amount = process.env.bicyclePrice ?? 2;
        if (currentTime >= 19 || currentTime <= 6) {
          amount += 1;
        }
      } else {
        res.status(400);
        throw new Error('Invalid type');
      }

      // Check if the balance has enough funds
      if (user.balance < amount) {
        res.status(402);
        throw new Error('Insufficient balance');
      }

      // Deduct the amount from the balance field
      user.balance -= amount;

      // Save the updated user
      await user.save();

      await UserActivity.create({
        message: `${user.name} checkout`,
        userId: user._id,
        amount: amount,
        type: type,
        name: user.name,
      })

      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }

  async transfer(req, res, next) {
    try {
      const { password, amount, receiverId, user_mac } = req.body
      if (!password || !amount || !receiverId || !user_mac) {
        res.status(400);
        throw new Error('Bad request');
      }
      const CLIENT_KEY = process.env.CLIENT_KEY;
      const isIntact = user_mac === CryptoJS.SHA256(`${CLIENT_KEY}|${amount}|${password}|${receiverId}`).toString();
      if (!isIntact) {
        res.status(400);
        throw new Error('Invalid mac')
      }
      const user = await User.findById(req.user._id);
      const passwordMatched = await user.matchPassword(password)

      if (!user) {
        res.status(404);
        throw new Error('Unrecognized user id');
      }
      if (!passwordMatched) {
        res.status(401);
        throw new Error('You have entered wrong password!');
      }
      if (amount <= 0) {
        res.status(400);
        throw new Error('Amount must greater than 0');
      }

      if (user.balance < amount) {
        res.status(401);
        throw new Error('Insufficent balance');
      }

      const receiver = await User.findById(receiverId);
      if (!receiver) {
        res.status(400);
        throw new Error('Unrecognized receiver id');
      }

      receiver.balance += amount;
      user.balance -= amount;

      await receiver.save();
      await user.save();

      await Transaction.create({
        method: 'CLIENT',
        type: 'TRANSFER',
        amount: parseFloat(amount),
        status: 'SUCCEED',
        created_by: user._id.toString(),
        receiver: {
          id: receiver._id.toString(),
          name: receiver.name,
          email: receiver.email,
        }
      })
      delete user.password;
      user.toObject();
      res.status(200).json({ message: "Transfer successfully", user });
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BalanceController();
