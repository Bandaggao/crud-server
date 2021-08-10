const uuid4 = require('uuid/v4');
const successTypes = require('./success-types');
const errorTypes = require('./error-types');

module.exports = {
  db: {
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    sslKey: process.env.DB_SSL_KEY
  },
  roles: {
    SALES: 1,
    MANCOM: 2,
    SALES_HEAD: 3,
    BSG_HEAD: 4,
    STG_HEAD: 5,
    MARKETING: 6,
    EAGG: 7,
    ADMIN: 8
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
