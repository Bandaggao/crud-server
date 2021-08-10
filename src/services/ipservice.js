const httpClient = require('../core/httpClient');
const baseurl = process.env.BYAHEROS_BASE_URL
const config = {
  headers:{
    'BYA-Subscription-Key': process.env.BYAHEROS_API_KEY
  }
};

const getQuotation = function (url) {
  return httpClient.get(url);
};

const createBooking = function (url, body) {
  return httpClient.post(baseurl+url, body, config);
};

module.exports = {
  getQuotation,
  createBooking,
};
