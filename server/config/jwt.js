const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in the environment variables");
    }
  
    return jwt.sign({ id }, process.env.JWT_SECRET);
  };

module.exports = generateToken