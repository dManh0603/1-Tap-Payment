const User = require('../models/UserModel');
const Transaction = require('../models/TransactionModel');
const generateToken = require('../config/jwt');
const UserActivity = require('../models/UserActivityModel');
const Config = require('../models/ConfigModel');

class AdminController {

  async getMonthlyIncome() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const monthlyTransactions = await Transaction.find({
      createdAt: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
      status: "SUCCEED",
    });

    let monthlyIncome = 0;
    monthlyTransactions.forEach((transaction) => {
      monthlyIncome += transaction.amount;
    });

    return monthlyIncome;
  }

  async getAnnualIncome() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const yearlyTransactions = await Transaction.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "SUCCEED",
    });

    let annualIncome = 0;
    yearlyTransactions.forEach((transaction) => {
      annualIncome += transaction.amount;
    });

    return annualIncome;
  }

  async getSucceedTransactionCount() {
    const transaction = await Transaction.find({
      status: 'SUCCEED'
    });
    const transactionCount = transaction.length;
    return transactionCount;
  }

  async getTransactionCount() {
    const transaction = await Transaction.find({});
    const transactionCount = transaction.length;
    return transactionCount;
  }

  getDashboard = async (req, res, next) => {
    try {
      // line chart
      const monthlyIncomePromise = this.getMonthlyIncome();
      const annualIncomePromise = this.getAnnualIncome();
      const transactionCountPromise = this.getTransactionCount();
      const succeedTransactionCountPromise = this.getSucceedTransactionCount();

      const [monthlyIncome, annualIncome, transactionCount, succeedTransactionCount] = await Promise.all([
        monthlyIncomePromise,
        annualIncomePromise,
        transactionCountPromise,
        succeedTransactionCountPromise
      ]);

      return res.status(200).json({ monthlyIncome, annualIncome, transactionCount, succeedTransactionCount });
    } catch (error) {
      next(error)
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('Bad request');
      }

      const user = await User.findOne({ email, role: 'admin' });
      if (!user) {
        res.status(401);
        throw new Error('You have entered wrong email or password!');
      }

      const passwordMatched = await user.matchPassword(password)
      if (!passwordMatched) {
        res.status(401);
        throw new Error('You have entered wrong password!');
      }

      res.status(200).json({
        message: 'User login successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          balance: user.balance,
          token: generateToken(user._id)
        }
      });
    } catch (err) {
      next(err)
    }
  }

  getTransactions = async (req, res, next) => {
    try {
      const transactions = await Transaction.find().populate('created_by', 'email name');

      const transactionsWithUserEmail = transactions.map((transaction) => ({
        ...transaction.toObject(),
      }));

      res.json({ transactions: transactionsWithUserEmail });
    } catch (error) {
      next(error)
    }
  };

  getTransactionDetails = async (req, res, next) => {
    const transactionId = req.params.id;
    try {
      const transaction = await Transaction.findById(transactionId).populate('created_by', 'email name').lean().exec();
      if (!transaction) {
        res.status(404);
        throw new Error('No transaction found with the provided id')
      }
      res.status(200).json(transaction);
    } catch (error) {
      next(error)
    }
  }

  getUsers = async (req, res, next) => {
    try {
      const users = await User.find({ role: { $ne: 'admin' } }).select('-password');

      return res.json(users);
    } catch (error) {
      next(error)
    }
  }

  getUserDetails = async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId).lean().select('-password').exec();
      if (!user) {
        res.status(404);
        throw new Error('No user found with the provided id');
      }
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }

  updateUserDetails = async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400);
        throw new Error('Bad request');
      }

      const body = req.body;
      if (!body) {
        res.status(400);
        throw new Error('Bad request');
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error('No user found with the provided id.');
      }

      if (!isNaN(body.balance) && Number(body.balance) >= 0) {
        user.balance = body.balance;
      } else {
        res.status(400);
        throw new Error('Bad request');
      }

      if (body.name !== '') {
        user.name = body.name;
      }

      if (body.card_uid !== '') {
        user.card_uid = body.card_uid;
      }

      if (body.card_disabled !== undefined) {
        user.card_disabled = body.card_disabled;
      }

      // Save the updated user document
      await user.save();

      res.json({ user: user, message: 'User details updated successfully' });
    } catch (error) {
      next(error)
    }
  }

  getUserActivities = async (req, res, next) => {
    try {
      const activities = await UserActivity.find({}).sort({ timestamp: -1 }).lean().exec();
      res.json(activities);
    } catch (error) {
      next(error)
    }
  };

  async getMonthlyActivity(req, res, next) {
    try {
      let currentMonth;
      let currentYear;
      if (req.params.date) {
        const [year, month] = req.params.date.split('-');
        currentMonth = parseInt(month, 10);
        currentYear = parseInt(year, 10);
      } else {
        currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
        currentYear = new Date().getFullYear(); // Get current year
      }

      const activityCounts = await UserActivity.aggregate([
        {
          $addFields: {
            month: { $month: '$createdAt' }, // Extract month from timestamp field
            year: { $year: '$createdAt' }, // Extract year from timestamp field
          },
        },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$month', currentMonth] }, // Match the current month
                { $eq: ['$year', currentYear] }, // Match the current year
              ],
            },
          },
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: '$_id',
            count: 1,
          },
        },
      ]).exec();

      res.json({ currentMonth, currentYear, activityCounts });
    } catch (error) {
      next(error)
    }
  }

  getConfig = async (req, res, next) => {
    try {
      const config = await Config.findOne({}); // Fetch the configuration document
      if (!config) {
        res.status(404);
        throw new Error('No config found');
      }

      res.json({
        motorbikePrice: config.motorbike_price,
        bicyclePrice: config.bicycle_price
      });
    } catch (error) {
      next(error)
    }
  }

  updateConfig = async (req, res, next) => {
    try {
      const { motorbikePrice, bicyclePrice } = req.body;

      const config = {
        motorbike_price: motorbikePrice,
        bicycle_price: bicyclePrice,
      };

      const updatedConfig = await Config.findOneAndUpdate({}, config);

      if (!updatedConfig) {
        throw new Error('Update config failed.');
      }
      process.env.motorbikePrice = motorbikePrice;
      process.env.bicyclePrice = bicyclePrice;

      res.status(200).json({ message: 'Config updated successfully' });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = new AdminController();
