const mongoose = require('mongoose');

// Define the Transaction schema
const ZalopayTransactionSchema = mongoose.Schema(
  {
    amount: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Pending'},
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt fields
  }
);

// Create the ZalopayTransaction model
const ZalopayTransaction = mongoose.model('ZalopayTransaction', ZalopayTransactionSchema);

module.exports = ZalopayTransaction;
