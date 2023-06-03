const Transaction = require('../models/TransactionModel');
class TransactionController {

  async create(req, res) {
    try {
      const { payment_id, status, amount, create_time, update_time, email_address } = req.body;
      const { _id: user_id } = req.user;

      const transaction = await Transaction.create({
        PP_info: {
          payment_id,
          status,
          create_time,
          update_time,
          payer_email_address: email_address
        },
        amount: parseFloat(amount),
        user_id
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
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
    res.json(req.user);
  }

}

module.exports = new TransactionController();
