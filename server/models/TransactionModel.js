const mongoose = require('mongoose');

// Define the Transaction schema
const TransactionSchema = mongoose.Schema(
  {
    method: { type: String, required: true },
    info: {
      payment_id: { type: String, required: true },
      status: { type: String, required: true },
      create_time: { type: Date, required: true },
      update_time: { type: Date, required: true },
      payer_id: { type: String },
      payer_email_address: { type: String },
    },
    amount: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt fields
  }
);

// Create the Transaction model
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
