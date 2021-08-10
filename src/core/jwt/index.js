const TAG = '[JWT]';
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { jwtTypes } = require('../../config');

const JWT_TYPE = jwtTypes;

function sign(type, payload = {}) {
  let ACTION = '[sign]';
  logger.log('info', `${TAG}${ACTION}`, payload);
  return jwt.sign(payload, type.secret, type.options);
};

function verify(token, type) {
  let ACTION = '[verify]';
  return new Promise((resolve, reject) => {
    jwt.verify(token, type.secret, (err, code) => {
      if (err) {
        logger.log('error', `${TAG}${ACTION}`, err);
        reject(err);
      } else {
        logger.log('info', `${TAG}${ACTION}`, code);
        resolve(code);
      }
    });
  });
};

function decode(token, type) {
  let ACTION = '[decode]';
  let decoded = jwt.decode(token, type.options);
  logger.log('info', `${TAG}${ACTION}`, decoded);
  return decoded;
};

const token = {
  sign,
  verify,
  decode
};

module.exports = {
  JWT_TYPE,
  token
};
