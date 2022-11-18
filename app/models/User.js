const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('users', UserSchema)
