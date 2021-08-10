module.exports = {
  INTERNAL_SERVER_ERROR: {
    status: 500,
    body: {
      code: -1,
      message: 'Internal server error.'
    }
  },
  NOT_FOUND: {
    status: 404,
    body: {
      code: -2,
      message: 'Not found.'
    }
  },
  UNAUTHORIZED: {
    status: 401,
    body: {
      code: -3,
      message: 'Unauthorized'
    }
  },
  TOKEN_EXPIRED: {
    status: 401,
    body: {
      code: -3,
      message: 'Token Expired'
    }
  },

  INVALID_CREDENTIALS: {
    status: 401,
    body: {
      code: -4,
      message: 'Invalid email or password.'
    }
  },
  MAIL_BODY: {
    status: 500,
    body: {
      code: -4,
      message: 'Error sending email.'
    }
  },
  ACCOUNT_VERIFY_FAIL: {
    status: 400,
    body: {
      code: -5,
      message: 'Account verification failed.'
    }
  },
  INVALID_TOKEN: {
    status: 400,
    body: {
      code: -6,
      message: 'Invalid token.'
    }
  },
  MOBILE_NUMBER_EXISTS: {
    status: 409,
    body: {
      code: -9,
      message: 'Mobile Number already exists.'
    }
  },
  MOBILE_NUMBER_NOT_FOUND: {
    status: 404,
    body: {
      code: -2,
      message: 'Mobile Number not found in the system.'
    }
  },
  ENDPOINT_NOT_FOUND: {
    status: 404,
    body: {
      code: -8,
      message: 'Endpoint not found.'
    }
  },
  ALREADY_EXISTS: {
    status: 409,
    body: {
      code: -9,
      message: 'Data already exists.'
    }
  },
  BAD_REQUEST: {
    status: 400,
    body: {
      code: -10,
      message: 'Bad request.'
    }
  },
  INVALID_OLD_PASSWORD: {
    status: 200,
    body: {
      code: -11,
      message: 'Old password do not match.'
    }
  },
  INVALID_GCASH_REF_NO: {
    status: 401,
    body: {
      code: -7,
      message: 'Invalid Gcash Reference Number.'
    }
  },
  NO_STORE_FOUND: {
    status: 404,
    body: {
      code: -7,
      message: 'NO STORE FOUND.'
    }
  },
  NO_MERCHANT_FOUND: {
    status: 404,
    body: {
      code: -7,
      message: 'NO MERCHANT FOUND.'
    }
  },
  NO_PAYMENT_METHOD_FOUND: {
    status: 404,
    body: {
      code: -7,
      message: 'NO PAYMENT METHOD FOUND.'
    }
  },
  ADDR_OUT_OF_RANGE: {
    status: 404,
    body: {
      code: -7,
      message: 'ADDRESS IS OUT OF RANGE.'
    }
  },
  INVALID_FIELD: {
    status: 400-101,
    body: {
      code: 400-101,
      message: 'Merchant Id is different from first items'
    }
  },
  ACCESS_ROLE_DENIED: {
    status: 500,
    body: {
      code: -1,
      message: 'Access Role Denied.'
    }
  },
  DATE_COMPARISON_ERROR: {
    status: 500,
    body: {
      code: -1,
      message: 'Dates are not sync.'
    }
  },
  CANCELLATION_NOT_ALLOWED: {
    status: 405,
    body: {
      code: -7,
      message: 'Your Order has already been processed, you can not cancel it anymore.'
    }
  },
};