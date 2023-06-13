const logger = require('../config/logger')

const loggerMiddleware = function (req, res, next) {
  req.logger = logger;
  next();
}

module.exports=loggerMiddleware