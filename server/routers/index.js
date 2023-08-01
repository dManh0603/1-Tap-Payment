const userRouter = require('./UserRouter');
const balanceRouter = require('./BalanceRouter');
const transactionRouter = require('./TransactionRouter');
const adminRouter = require('./AdminRouter');
const chatRouter = require('./ChatRouter');
const messageRouter = require('./MessageRouter');
const cardRouter = require('./CardRouter');

const route = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/balance', balanceRouter);
  app.use('/api/transaction', transactionRouter);
  app.use('/api/chat', chatRouter)
  app.use('/api/message', messageRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/card', cardRouter)

  //error handler
  app.use((err, req, res, next) => {

    const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);
    const message = err.message || 'Internal server error';
    if (statusCode === 500) {
      const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        params: req.params,
        query: req.query,
      };

      req.logger.error(message, {
        request: requestInfo,
        stack: err.stack,
      });
    }
    return res.status(statusCode).json({ message });
  })
}

module.exports = route
