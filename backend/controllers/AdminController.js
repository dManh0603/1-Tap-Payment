const validator = require('validator');
const passwordValidator = require('password-validator');
const User = require('../models/UserModel');
const generateToken = require('../config/jwt');

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

class AdminController {

  index(req, res) {
    res.render('index');
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw { statusCode: 200, message: "You have entered wrong email or password!" };
      }

      const passwordMatched = await user.matchPassword(password)

      if (!passwordMatched) {
        throw { statusCode: 200, message: "You have entered wrong password!" };

      }

      console.log(`User: ${user._id} logged in.`)
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
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ message });
    }
  }

  async findUser(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password')

      if (!user) {
        throw { statusCode: 400, message: 'Something went wrong, please try again later!' }
      }
      return res.json(user)

    } catch (err) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ message });
    }
  }

}

module.exports = new AdminController();
