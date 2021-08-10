const { v4: uuid4 } = require('uuid');
const successTypes = require('./success-types');
const errorTypes = require('./error-types');

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    sslKey: process.env.DB_SSL_KEY
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
  ubp: {
    url: process.env.UNIONBANK_API_URL,
    client_id : process.env.UNIONBANK_CLIENT_ID,
    client_secret: process.env.UNIONBANK_CLIENT_SECRET,
    redirect_uri : process.env.UNIONBANK_REDIRECT_URI,
    partner_id: process.env.UNIONBANK_PARTNER_ID,
    scope: "payments",
    request_type: "code",
    grant_type: "authorization_code",
    type: "single"
  },
  successTypes,
  errorTypes
};
