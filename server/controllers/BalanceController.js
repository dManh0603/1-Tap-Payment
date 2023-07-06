const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel')

class BalanceController {
  async add(req, res) {
    try {
      const { amount, transactionId } = req.body;

      const coresponseTransaction = await Transaction.findById(transactionId);

      if (parseFloat(amount) === coresponseTransaction.amount) {
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { $inc: { balance: parseFloat(amount) } },
          { new: true }
        );
        res.json(user);
      } else {
        res.status(400).json('No corresponding transaction found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }


  async deduct(req, res) {
    try {
      const card_uid = req.params.card_uid;
      const type = req.body.type;
      const currentTime = new Date().getHours();

      // Find the user by card_uid
      const user = await User.findOne({ card_uid });

      if (!user) {
        throw { statusCode: 404, error: 'User not found' };
      }

      if (user.card_disabled === true) {
        throw { statusCode: 403, error: 'Card disabled' };
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
        throw { statusCode: 400, error: 'Invalid type' };
      }

      // Check if the balance has enough funds
      if (user.balance < amount) {
        throw { statusCode: 402, error: 'Insufficient balance' };
      }

      // Deduct the amount from the balance field
      user.balance -= amount;

      // Save the updated user
      await user.save();

      req.logger.info(`${user.name} checkout`, {
        userId: user._id.toString(),
        amount: amount,
        type: type,
        name: user.name.toString(),
      });

      res.status(200).json(user);
    } catch (error) {
      console.error('Error deducting amount:', error);
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    }
  }

  async transfer(req, res) {

    try {
      const { password, amount, receiverId } = req.body
      const user = await User.findById(req.user._id);
      const passwordMatched = await user.matchPassword(password)

      if (!user) {
        throw { statusCode: 400, message: 'Unrecognized user id' }
      }
      if (!passwordMatched) {
        throw { statusCode: 401, message: 'You have entered wrong password!' };
      }
      if (amount <= 0) {
        throw { statusCode: 400, message: 'Amount must greater than 0' };
      }

      if (user.balance < amount) {
        throw { statusCode: 401, message: 'Insufficent balance' };
      }

      const receiver = await User.findById(receiverId);
      if (!receiver) {
        throw { statusCode: 400, message: "unrecognized receiver id" }
      }
      req.logger.info
      receiver.balance += amount;
      user.balance -= amount;
      await user.save();
      await receiver.save();
      delete user.password;
      req.logger.info(`${user.name} transfer money to ${receiver.name}`, {
        sender_id: user._id.toString(),
        receiver_id: receiver._id.toString(),
        amount: amount
      })
      user.toObject();
      res.json({ message: "Transfer successfully", user })

    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error' });
    }
  }
}

module.exports = new BalanceController();
