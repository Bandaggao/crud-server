module.exports = {
  SUCCESS: {
    status: 200,
    body: {
      message: 'Success.'
    }
  },
  CREATED: {
    status: 201,
    body: {
      message: 'Successfully created.'
    }
  },
  UPDATED: {
    status: 200,
    body: {
      message: null
    }
  },
  ACCOUNT_AUTHENTICATED: {
    status: 200,
    body: {
      message: 'Successfully logged in.'
    }
  },
  ACCOUNT_VERIFY_SUCCESS: {
    status: 200,
    body: {
      message: 'Account successfuly verified.'
    }
  },
  ACCOUNT_LOGOUT: {
    status: 200,
    body: {
      message: 'Successfully logged out.'
    }
  },
  SUCCESS_CHANGE_PASSWORD: {
    status: 200,
    body: {
      message: 'Password successfully changed.'
    }
  }
};
