const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  motorbike_price: {
    type: Number,
    min: [1, 'Must larger than 1'],
    required: true,
  }, 
  bicycle_price: {
    type: Number,
    min: [1, 'Must larger than 1'],
    required: true,
  },
});

const Config = mongoose.model('Config', configSchema, 'configs');

module.exports = Config;
