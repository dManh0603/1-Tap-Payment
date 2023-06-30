const axios = require('axios');
const { getAppTime } = require('../helpers/ZalopayHelper');
const ZalopayTransaction = require('../models/ZalopayTransactionModel');
const CryptoJS = require('crypto-js');

class ZaloPayController {
  async create(req, res) {
    let transaction;
    try {
      const { paymentMethod, amount } = req.body;
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

      transaction = await ZalopayTransaction.create({
        amount: parseFloat(amount),
        user_id: req.user._id,
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

      const { data } = await axios.post(process.env.ZALOPAY_SANDBOX_ENDPOINT, body);

      res.json(data);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('ZaloPay API Error:', error.response.data);
        res.status(error.response.status).json({ error: 'ZaloPay API Error' });
      } else {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

      if (transaction) {
        transaction.status = 'Cancel';
        await transaction.save();
      }
    }
  }
}

module.exports = new ZaloPayController();