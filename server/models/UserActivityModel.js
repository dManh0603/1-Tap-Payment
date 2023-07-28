const mongoose = require('mongoose');

// Define the schema for user activities
const userActivitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
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
  {
    timestamps: true
  }
);

// Create the UserActivity model
const UserActivity = mongoose.model('UserActivity', userActivitySchema, 'userActivities');

module.exports = UserActivity;
