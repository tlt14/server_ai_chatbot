const authRouter = require('./auth')

module.exports = function router(app) {
  app.use('/api/auth', authRouter)
}
