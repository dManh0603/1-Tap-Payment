const userRouter = require('./UserRouter');
const balanceRouter = require('./BalanceRouter');

const route = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/balance', balanceRouter);
  app.get('/fetch', (req, res) => {
    res.json({ message: 'you did it' })
  })
}

module.exports = route
