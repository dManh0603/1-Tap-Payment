const formatAmount = (value) => {
  return value ? value.toLocaleString().replace(/,/g, ' ') : '0';
};

function convertToGMT7(dateString) {
  const date = new Date(dateString);
  const gmtOffset = 7 * 60 * 60 * 1000; // GMT+7 offset in milliseconds
  const gmt7Date = new Date(date.getTime() + gmtOffset);
  const formattedDate = gmt7Date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'GMT'
  });
  return formattedDate;
}

function formatPaymentRef(str) {
  if (str.length < 7) {
    return str;
  }
  return str.slice(0, 6) + '_' + str.slice(6);
}

module.exports = {
  formatAmount,
  convertToGMT7,
  formatPaymentRef,
}