const { REGEX_TYPE } = require('../core/validator');

module.exports = {
  email: {
    type: 'string',
    regex: REGEX_TYPE.IS_EMAIL,
    required: true,
    allownull: false
  },
  phone: {
    type: 'string',
    min: 11,
    max: 11,
    allownull: false,
    required: false
  },
  name: {
    type: 'string',
    min: 1,
    max: 25,
    required: true,
    allownull: false
  },
 
};
