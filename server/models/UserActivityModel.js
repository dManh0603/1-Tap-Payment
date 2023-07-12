const mongoose = require('mongoose');

// Define the schema for user activities
const userActivitySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  meta: {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['motorbike', 'bicycle'],
      required: true,
    },
    name: {
      type: String,
      require: true,
    }
  },
});

// Create the UserActivity model
const UserActivity = mongoose.model('UserActivity', userActivitySchema, 'userActivities');

module.exports = UserActivity;
