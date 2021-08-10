const TAG = '[FCM]';

const moment = require('moment');

const ajax = require('../services/Ajax');
const Logger = require('../core/logger');
const Error = require('../services/Errors');

const api_url = process.env.FIREBASE_NOTIFICATION_API_URL;
const api_key = process.env.FIREBASE_NOTIFICATION_API_KEY;

module.exports.push = async (order, tokens) => {
  const ACTION = '[push notification to merchant]';
  const uri = `${api_url}`;
  Logger.log('info', `${TAG}${ACTION} - order `, order);
  Logger.log('info', `${TAG}${ACTION} - tokens`, tokens);

  return new Promise((resolve, reject) => {
    ajax
      .setOptions({
        uri,
        headers: {
          'Authorization' : api_key,
          'Content-Type': 'application/json',
        },      
      })
      .post({
        'notification' : {
          'title' : 'AGORAPH',
          'message' : 'You have new order',
          'sound' : 'default'
        },
        'data' : {
          'title' : 'AGORAPH',
          'message' : 'You have new order',
          'Year' : moment(order.delivery_date).format('YYYY'),
          'Month' : moment(order.delivery_date).format('MM'),
          'MerchantID' : order.merchant_id,
          'AlarmID' : order.refererence_number
        },
        'registration_ids' : tokens
      })
      .then(res => {
        Logger.log('info', `${TAG}${ACTION} - result`, res.body);
        const body = res.body;
        if (!body.error) {
          resolve(body);
        }
        else {
          reject({
            status: 200,
            error: body
          });
        }
      })
      .catch(err => {
        Logger.log('Push notification error: ', err);
        reject(Error.raise('INTERNAL_SERVER_ERROR', err));
      });
  });
};