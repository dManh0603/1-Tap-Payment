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
      const amount = req.body.amount;

      // Find the user by card_uid
      const user = await User.findOne({ card_uid });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the balance has enough funds
      if (user.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Deduct the amount from the balance field
      user.balance -= amount;

      // Save the updated user
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error deducting amount:', error);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new BalanceController();
