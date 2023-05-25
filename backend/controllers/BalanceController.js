const User = require('../models/UserModel')

class BalanceController {
  async deposit(req, res) {
    try {
      const { amount } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { balance: amount } },
        { new: true }
      );

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BalanceController();
