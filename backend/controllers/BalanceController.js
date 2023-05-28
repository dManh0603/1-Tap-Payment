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
      const userId = req.user._id;
      const amount = req.body.amount;

      // Find the user by userId and deduct the amount from the balance field
      const user = await User.findByIdAndUpdate(userId, { $inc: { balance: -amount } }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error deducting amount:', error);
      res.status(500).json({ error: 'Failed to deduct amount' });
    }
  }

}

module.exports = new BalanceController();
