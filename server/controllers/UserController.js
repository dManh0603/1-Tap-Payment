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

class UserController {

  async signup(req, res) {
    const { name, email, password } = req.body;

    try {
      if (!name || !email || !password) {
        throw { statusCode: 400, message: 'Please fill in all the required fields' };
      }

      if (!validator.isEmail(email)) {
        throw { statusCode: 400, message: 'Please provide a valid email' };
      }

      if (!passwordSchema.validate(password)) {
        throw { statusCode: 400, message: 'Password should be at least 8 characters long and contain uppercase, lowercase, and numeric characters with no whitespace' };
      }

      const emailExisted = await User.findOne({ email });
      if (emailExisted) {
        throw { statusCode: 400, message: 'Email already exists' };
      }

      const user = await User.create({ name, email, password, });

      if (!user) {
        throw { statusCode: 500, message: 'Failed to create new user' };
      }

      console.log('Created new user!');

      res.status(200).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });

    } catch (err) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw { statusCode: 401, message: "You have entered wrong email or password!" };
      }

      const passwordMatched = await user.matchPassword(password)

      if (!passwordMatched) {
        throw { statusCode: 401, message: "You have entered wrong password!" };

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

  async getUser(req, res) {
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

  async disableCard(req, res) {
    const userId = req.user._id;
    const password = req.body.password
    try {
      // Find the user by their _id and update the card_disable field to true
      const user = await User.findByIdAndUpdate(userId, { card_disabled: true });
      if (!user) {
        // User with the given _id not found
        return res.status(404).json({ message: 'User not found' });
      }
      const passwordMatched = await user.matchPassword(password)
      if (!passwordMatched) {
        throw { statusCode: 401, message: "You have entered wrong password!" };

      }
      // Card disabled successfully
      return res.json({ message: 'Card disabled successfully' });
    } catch (err) {
      // Handle error
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ message });
    }
  }

  async searchUser(req, res) {
    try {
      const keyword = req.params.keyword;

      // Use a regular expression to perform a case-insensitive search for email or username
      const regex = new RegExp(keyword, 'i');
      const users = await User.find({
        $or: [
          { email: { $regex: regex } },
          { name: { $regex: regex } }
        ]
      }).select('name email _id role').lean();

      res.json(users);
    } catch (error) {
      // Handle any errors that occur during the search
      res.status(500).json({ error: 'An error occurred while searching for users.' });
    }
  }


}

module.exports = new UserController();
