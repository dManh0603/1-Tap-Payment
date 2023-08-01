const winston = require('winston');
const { format } = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

// Configure the file transport
const fileTransport = new winstonDailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m', // Maximum size of each log file
  maxFiles: '7d', // Keep logs for 7 days
  format: format.combine(
    format.metadata(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, metadata }) => {
      delete metadata.timestamp;
      return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
    })
  )
});

// Create and export the logger instance
const logger = winston.createLogger({
  transports: [
    fileTransport
  ]
});

module.exports = logger;
