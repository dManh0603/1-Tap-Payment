const moment = require('moment-timezone');

module.exports = {

  formatAmount: function (value) {
    return value ? value.toLocaleString().replace(/,/g, ' ') : '0';
  },
  
  formatDate: function (dateString) {
    // Use Moment.js library to parse and manipulate the date/time string
    const date = moment(dateString).tz('Asia/Bangkok').utcOffset('+0700');

    // Format the date/time string in the desired format (day-month-year-time)
    const formattedDate = date.format('MMM DD YYYY HH:mm:ss');

    // Return the formatted date/time string
    return formattedDate;
  }
}