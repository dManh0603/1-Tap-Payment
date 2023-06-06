const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminAuthenticate = async (req, res, next) => {
  let encodedToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      encodedToken = req.headers.authorization.split(' ')[1]
      if (!encodedToken) {
        throw { statusCode: 401, message: 'Please login first!' }
      }

      const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET);
      const admin = await User.findOne({ _id: decodedToken.id, role: 'admin' }).select('-password').exec();
      if (!admin) {
        throw { statusCode: 404, message: 'Incorrect admin id' }
      }
      next()
    } catch (error) {
      console.log(error);
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    }
  }

}

module.exports = adminAuthenticate