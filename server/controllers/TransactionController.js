const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const { getAppTime } = require('../helpers/ZalopayHelper');
const axios = require('axios');

class TransactionController {

  // [POST] /api/transaction/paypal/create
  async paypalCreate(req, res) {
    try {
      const { payment_id, status, amount, create_time, update_time, email_address, payer_id, receiver_id } = req.body;

      const receiver = await User.findById(receiver_id).select('name email _id').exec();
      if (!receiver) {
        throw { statusCode: 404, message: 'Unrecognized receiver id' }
      }

      const transaction = await Transaction.create({
        method: 'PAYPAL',
        type: 'DEPOSIT',
        status,
        info: {
          payment_id,
          create_time,
          payer_id,
          update_time,
          payer_email_address: email_address
        },
        amount: parseFloat(amount),
        created_by: req.user._id,
        receiver: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
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

  // [POST] /api/transaction/zalopay/create
  async zalopayCreate(req, res) {
    let transaction;
    try {
      const { paymentMethod, amount, } = req.body;
      let embed_data = null;
      let bank_code = null;

      switch (paymentMethod) {
        case 'CC':
          bank_code = 'CC';
          embed_data = JSON.stringify({});
          break;
        case 'ATM':
          bank_code = '';
          embed_data = JSON.stringify({ "bankgroup": 'ATM' });
          break;
        case 'zalopayapp':
          bank_code = 'zalopayapp';
          embed_data = JSON.stringify({});
          break;
        default:
          throw new Error('Invalid payment method');
      }

      transaction = await Transaction.create({
        method: 'ZALOPAY',
        type: 'DEPOSIT',
        status: 'PENDING',
        info: {
          payment_id: '',
          create_time: '',
          payer_id: '',
          update_time: '',
          payer_email_address: '',
        },
        amount: parseFloat(amount),
        created_by: req.user._id,
        receiver: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      });

      const currentDate = getAppTime();
      const user_id = req.user._id.toString();
      const app_id = parseInt(process.env.ZALOPAY_APP_ID);
      const app_user = user_id;
      const app_time = Date.now();
      const app_trans_id = `${currentDate}_${transaction._id}`;
      const item = JSON.stringify([]);
      const description = `Zalopay - Nạp tiền vào tài khoản - Giao dịch #${transaction._id}`;
      const key1 = process.env.ZALOPAY_APP_KEY;
      const hmac_input = `${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;
      const hmac = CryptoJS.HmacSHA256(hmac_input, key1);
      const mac = hmac.toString(CryptoJS.enc.Hex);

      const body = {
        app_id,
        app_user,
        app_time,
        amount,
        app_trans_id,
        item,
        description,
        embed_data,
        bank_code,
        mac,
      };

      transaction.app_trans_id = app_trans_id;

      const { data } = await axios.post(process.env.ZALOPAY_SANDBOX_CREATE_ENDPOINT, body);
      res.json({ ...data, app_trans_id });

    } catch (error) {
      if (error.response && error.response.data) {
        console.error('ZaloPay API Error:', error.response.data);
        res.status(error.response.status).json({ error: 'ZaloPay API Error' });
      } else {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

      if (transaction) {
        transaction.status = 'Canceled';
      }
    } finally {
      await transaction.save();
    }
  }

  // [POST] /api/transaction/zalopay/query
  async zalopayQuery(req, res) {
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    try {
      const app_id = parseInt(process.env.ZALOPAY_APP_ID);
      const app_trans_id = req.body.app_trans_id
      const key1 = process.env.ZALOPAY_APP_KEY;
      const hmac_input = app_id + "|" + app_trans_id + "|" + key1;
      const hmac = CryptoJS.HmacSHA256(hmac_input, key1);
      const mac = hmac.toString(CryptoJS.enc.Hex);

      const body = {
        app_id,
        app_trans_id,
        mac
      }
      let trialCount = 0;
      let data;
      do {
        console.log('Trial number:', trialCount + 1);
        await delay(30000);

        const response = await axios.post(process.env.ZALOPAY_SANDBOX_QUERY_ENDPOINT, body);
        data = response.data;
        console.log(data)
        trialCount++;
      } while (data.return_code === 3 && trialCount < 15);

      const transaction = await Transaction.findOne({ app_trans_id });

      if (data.return_code === 2) {
        transaction.status = 'CANCELED';
      }
      if (data.return_code === 1) {
        transaction.status = 'SUCCEED';
        await User.findByIdAndUpdate(
          req.user._id,
          { $inc: { balance: data.amount } },
          { new: true }
        );
      }
      await transaction.save();
      res.json(transaction.status)
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

module.exports = new TransactionController();
