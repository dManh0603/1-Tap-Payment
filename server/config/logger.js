const winston = require('winston');
const { format } = require('winston');
require('winston-mongodb');

// Configure MongoDB transport
winston.add(new winston.transports.MongoDB({
  db: process.env.MONGODB_URI, // MongoDB connection string
  collection: 'userActivities', // Collection name to store logs
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  format: format.combine(
    format.timestamp(),
    format.metadata(), // Include metadata in the log message
    format.printf(({ timestamp, level, message, metadata }) => {
      return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
    })
  )
}));

// Create and export the logger instance
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), // Optional: Log to the console as well
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI, // MongoDB connection string
      collection: 'userActivities', // Collection name to store logs
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      format: format.combine(
        format.metadata(), // Include metadata in the log message
        format.printf(({ timestamp, level, message, metadata }) => {
          return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
        })
      )
    })
  ]
});

module.exports = logger;
