const axios = require('axios')
const { getAppTime } = require('../helpers/ZalopayHelper')
const ZalopayTransaction = require('../models/ZalopayTransactionModel');
const CryptoJS = require('crypto-js');

class ZaloPayController {

  create = async (req, res) => {
    try {
      const transaction = await ZalopayTransaction.create({
        amount: req.body.amount,
        user_id: req.user._id,
      });

      // Construct the body for ZaloPay request
      const currentDate = getAppTime();
      const amount = transaction.amount;
      const user_id = transaction.user_id.toString();
      const app_id = parseInt(process.env.ZALOPAY_APP_ID);
      const app_user = user_id;
      const app_time = Date.now();
      const app_trans_id = `${currentDate}_${transaction._id}`;
      const item = JSON.stringify([]);
      const description = `Zalopay - Nạp tiền vào tài khoản - Giao dịch #${transaction._id}`;
      const embed_data = JSON.stringify({});
      const bank_code = 'zalopayapp';

      // Construct the hmac_input string and key
      const key1 = process.env.ZALOPAY_APP_KEY;
      const hmac_input = `${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;

      // Generate HMAC
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
      // Handle error and update transaction status
      if (error.response && error.response.data) {
        // ZaloPay API error
        console.error('ZaloPay API Error:', error.response.data);
        // Handle the specific error and send an appropriate response to the client
        res.status(error.response.status).json({ error: 'ZaloPay API Error' });
      } else {
        // Other errors
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

      // Update transaction status to 'Cancel'
      if (transaction) {
        transaction.status = 'Cancel';
        await transaction.save();
      }
    }
  }



}

module.exports = new ZaloPayController();