const mongoose = require('mongoose')
async function connect() {
  try {
    await mongoose.connect(process.env.URL_MongoDB)
    console.log('mongodb connection')
  } catch (e) {
    log.error('mongodb connection error')
  }
}
module.exports = { connect }
