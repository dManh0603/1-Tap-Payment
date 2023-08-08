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
      resizeBy.status(404)
      throw new Error('No config document found')
    }

    process.env.motorbikePrice = config.motorbike_price;
    process.env.bicyclePrice = config.bicycle_price;

  } catch (error) {
    next(error)
  }
}

module.exports = { connect, config };
