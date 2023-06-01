const User = require('../models/UserModel');
const Transaction = require('../models/TransactionModel');
const generateToken = require('../config/jwt');

class AdminController {

  index(req, res) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    return res.render('index', {
      layout: 'blank.hbs'
    });
  }

  async getMonthlyIncome() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
  
    const monthlyTransactions = await Transaction.find({
      "createdAt": { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
    });
  
    let monthlyIncome = 0;
    monthlyTransactions.forEach((transaction) => {
      monthlyIncome += transaction.amount;
    });
  
    console.log(monthlyIncome);
    return monthlyIncome;
  }
  

  async getAnnualIncome() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const yearlyTransactions = await Transaction.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    let annualIncome = 0;
    yearlyTransactions.forEach((transaction) => {
      annualIncome += transaction.amount;
    });

    console.log(annualIncome);
    return annualIncome;
  }



  async getUserCount() {
    const users = await User.find();
    const userCount = users.length;
    return userCount;
  }

  dashboard = async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/');
    }

    try {
      const monthlyIncome = await this.getMonthlyIncome();
      const annualIncome = await this.getAnnualIncome();
      const userCount = await this.getUserCount();

      return res.render('dashboard', { monthlyIncome, annualIncome, userCount });
    } catch (error) {
      console.error(error);
      return res.render('error', { error });
    }
  }


  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email, role: "admin" });
      if (!user) {
        return res.render('index', {
          email,
          error: "You have entered wrong password or email"
        })

      }

      const passwordMatched = await user.matchPassword(password)

      if (!passwordMatched) {
        return res.render('index', {
          email,
          error: "You have entered wrong password"
        })
      }

      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      console.log(`Admin: ${user._id} logged in.`)
      return res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      return res.render('error', err)
    }
  }

  async getToken(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email, role: "admin" });
      if (!user) {
        throw { statusCode: 401, message: "Wrong email or password!" };
      }

      const passwordMatched = await user.matchPassword(password)

      if (!passwordMatched) {
        throw { statusCode: 401, message: "Wrong password!" };
      }

      console.log(`Admin: ${user._id} get token successfully.`)
      res.status(200).json({
        message: 'Admin get token successfully',
        token: generateToken(user._id),

      });
    } catch (err) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ message });
    }
  }

}

module.exports = new AdminController();
