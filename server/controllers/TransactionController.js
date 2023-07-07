const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');
class TransactionController {

  async create(req, res) {
    try {
      const { payment_id, status, amount, create_time, update_time, email_address, method, payer_id, receiver_id, type } = req.body;

      const receiver = await User.findById(receiver_id).select('name email _id').exec();
      if (!receiver) {
        throw { statusCode: 404, message: 'Unrecognized receiver id' }
      }

      const transaction = await Transaction.create({
        method,
        type,
        info: {
          payment_id,
          status,
          create_time,
          payer_id,
          update_time,
          payer_email_address: email_address
        },
        amount: parseFloat(amount),
        created_by: req.user._id,
        receiver: {
          id: receiver_id,
          name: receiver.name,
          email: receiver.email
        }
      });

      res.json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create transaction' });
    }
  }

  async fetchMonthly(req, res) {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;

      // Initialize an array to store the monthly sums
      const monthlySums = Array(currentMonth).fill(0);

      // Query the transactions collection and calculate the sums for each month
      const result = await Transaction.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            monthlyIncome: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Iterate through the result and update the monthly sums array
      result.forEach(item => {
        const monthIndex = item._id - 1;
        monthlySums[monthIndex] = item.monthlyIncome;
      });

      // Fill in zeros for missing months
      for (let i = 0; i < currentMonth; i++) {
        if (monthlySums[i] === 0) {
          monthlySums[i] = 0;
        }
      }

      return res.json(monthlySums);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserTransactions(req, res) {
    try {
      const userId = req.user._id;
      const transactions = await Transaction.find({ created_by: userId }).sort({ createdAt: -1 }).exec();
      const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);
      res.json({ transactions, totalAmount });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


}

module.exports = new TransactionController();
