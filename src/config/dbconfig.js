const { v4: uuid4 } = require('uuid');
const successTypes = require('./success-types');
const errorTypes = require('./error-types');

module.exports = {
  db: {
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    name: process.env.DB2_NAME,
    port: process.env.DB2_PORT,
    sslKey: process.env.DB2_SSL_KEY
  },

  jwtTypes: {
    SSO: {
      secret: process.env.JWT_SSO_SECRET,
      options: {
        expiresIn: process.env.JWT_SSO_EXP || '1d',
        issuer: process.env.JWT_SSO_ISS,
        subject: process.env.JWT_SSO_SUB,
        audience: process.env.JWT_SSO_AUD,
        jwtid: uuid4()
      }
    },
    VERIFY_ACCT: {
      secret: process.env.JWT_SSO_SECRET,
      options: {
        expiresIn: process.env.JWT_VERIFY_EXP || '31d',
        issuer: process.env.JWT_VERIFY_ISS,
        subject: process.env.JWT_VERIFY_SUB,
        audience: process.env.JWT_VERIFY_AUD,
        jwtid: uuid4()
      }
    }
  },
  successTypes,
  errorTypes
};
