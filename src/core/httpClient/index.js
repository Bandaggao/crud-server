const axios = require('axios');

const logger = require('../logger');

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    logger.info({
      message: 'Sending request:',
      data: config,
    });

    return config;
  },
  (error) => {
    // Do something with request error
    logger.error({
      message: 'Error on request:',
      data: error,
    });

    return Promise.reject(error);
  },
);

// // Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    logger.info({
      message: 'Success response:',
      data: response,
    });
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    logger.error({
      message: 'Request failed:',
      data: error,
    });
    // switch (error.response.status) {
    //   case 401:
    //     break;

    //   case 400:
    //     break;

    //   case 404:
    //     break;

    //   default:
    //     break;
    // }
    return Promise.reject(error);
  },
);

module.exports = axios;