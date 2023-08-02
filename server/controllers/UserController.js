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

  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400);
        throw new Error('Bad request');
      }

      if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error('Invalid email');
      }

      if (!passwordSchema.validate(password)) {
        res.status(400);
        throw new Error('Password should be at least 8 characters long and contain uppercase, lowercase, and numeric characters with no whitespace');
      }

      const emailExisted = await User.findOne({ email });
      if (emailExisted) {
        res.status(400);
        throw new Error('Email already exists')
      }

      const user = await User.create({ name, email, password, });

      res.status(200).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });

    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401);
        throw new Error('You have entered wrong email or password!')
      }

      const passwordMatched = await user.matchPassword(password)

      if (!passwordMatched) {
        res.status(401);
        throw new Error('You have entered wrong password!')
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

  async getUser(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select('-password')

      if (!user) {
        res.status(404)
        throw new Error('No user found with the provided id');
      }
      res.json(user)

    } catch (error) {
      next(error)
    }
  }

  async disableCard(req, res, next) {
    try {
      const userId = req.user._id;
      const password = req.body.password
      if (!userId || !password) {
        res.status(400);
        throw new Error('Bad request');
      }
      // Find the user by their _id and update the card_disable field to true
      const user = await User.findByIdAndUpdate(userId, { card_disabled: true });
      if (!user) {
        res.status(404);
        throw new Error('No user found with the provided id')
      }
      const passwordMatched = await user.matchPassword(password)
      if (!passwordMatched) {
        res.status(401);
        throw new Error('You have entered wrong password!');
      }
      res.json({ message: 'Card disabled successfully' });
    } catch (error) {
      next(error)
    }
  }

  async searchUser(req, res, next) {
    try {
      const keyword = req.params.keyword;
      if (!keyword) {
        res.status(400);
        throw new Error('Bad request');
      }
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
      next(error)
    }
  }
}

module.exports = new UserController();
