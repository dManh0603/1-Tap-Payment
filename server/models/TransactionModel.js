const mongoose = require('mongoose');

// Define the Transaction schema
const TransactionSchema = mongoose.Schema(
  {
    method: { type: String, required: true },
    type: { type: String, required: true },
    info: {
      payment_id: { type: String },
      status: { type: String },
      create_time: { type: Date },
      update_time: { type: Date },
      payer_id: { type: String },
      payer_email_address: { type: String },
    },
    amount: { type: Number, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    }
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt fields
  }
);

// Create the Transaction model
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
