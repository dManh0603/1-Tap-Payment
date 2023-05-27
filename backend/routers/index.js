const userRouter = require('./UserRouter');
const balanceRouter = require('./BalanceRouter');
const transactionRouter = require('./TransactionRouter');

const route = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/balance', balanceRouter);
  app.use('/api/transaction', transactionRouter);
  app.get('/fetch', (req, res) => {
    res.json({ message: 'you did it' })
  })
}

module.exports = route
