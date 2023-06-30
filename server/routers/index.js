const userRouter = require('./UserRouter');
const balanceRouter = require('./BalanceRouter');
const transactionRouter = require('./TransactionRouter');
const adminRouter = require('./AdminRouter');
const chatRouter = require('./ChatRouter');
const messageRouter = require('./MessageRouter');
const cardRouter = require('./CardRouter');
const ZaloPayRouter = require('./ZaloPayRouter');

const route = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/balance', balanceRouter);
  app.use('/api/transaction', transactionRouter);
  app.use('/api/chat', chatRouter)
  app.use('/api/message', messageRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/card', cardRouter)
  app.use('/api/zalopay', ZaloPayRouter)

  // // handle 404
  // app.use((req, res, next) => {
  //   return res.status(404).render('error', {
  //     layout: 'blank'
  //   })
  // })
}

module.exports = route
