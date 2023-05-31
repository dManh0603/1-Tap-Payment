// const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminAuthenticate = async (req, res, next) => {
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

    next();
  } catch (err) {
    console.error(err);
    res.render('error', err)
    // const statusCode = err.statusCode || 500;
    // const message = err.message || 'Internal server error';
    // res.status(statusCode).json({ message });
  }

}

module.exports = adminAuthenticate