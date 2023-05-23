const authRouter = require('./AuthRouter');

const route = (app) => {
  
  app.use('/api/user', authRouter);

}

module.exports = route
