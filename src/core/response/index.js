// const successTypes = require('./success-types');
// const errorTypes = require('./error-types');
const { successTypes, errorTypes } = require('../../config');

function getKeyTypes(responseTypes) {
  return Object.keys(responseTypes).reduce((accu, curr) => {
    accu[curr] = curr;
    return accu;
  }, {});
}

function getResponse(i, message = null, data = null) {
  const types = {
    ...successTypes,
    ...errorTypes
  };
  // This code will deep copy the object to prevent direct mutations to `successTypes` and `errorTypes` object.
  const response = JSON.parse(JSON.stringify(types[i]));
  if (message) response.body.message = message;
  if (data) response.body.data = data;
  return response;
}

module.exports = {
  ...getKeyTypes(errorTypes),
  ...getKeyTypes(successTypes),
  response: (info, message = null, data = null) => {
    return getResponse(info, message, data);
  }
};
