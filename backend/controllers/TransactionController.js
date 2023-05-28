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

}

module.exports = new TransactionController();
