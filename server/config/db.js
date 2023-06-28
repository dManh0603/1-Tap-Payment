const mongoose = require('mongoose');
const Config = require('../models/ConfigModel');
mongoose.set("strictQuery", false);

async function connect() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Neu_Parking_Payment'
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    throw error;
  }
}

async function config() {
  try {
    const config = await Config.findOne({}); // Fetch the configuration document
    if (!config) {
      console.error('No config document found');
      return;
    }

    process.env.motorbikePrice = config.motorbike_price; // Set the environment variable
    process.env.bicyclePrice = config.bicycle_price; // Set the environment variable

  } catch (error) {
    console.error('Error retrieving config:', error);
  }
}

module.exports = { connect, config };
