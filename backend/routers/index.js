const userRouter = require('./UserRouter');
const balanceRouter = require('./BalanceRouter');

const route = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/balance', balanceRouter);
}

module.exports = route
