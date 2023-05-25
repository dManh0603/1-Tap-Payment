const mongoose = require('mongoose')


const TransactionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model('Transaction', TransactionSchema)
module.exports = user