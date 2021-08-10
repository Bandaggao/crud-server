const { REGEX_TYPE } = require('../core/validator');

module.exports = {
  gcash_ref_number: {
		type: 'number',
		regex: REGEX_TYPE.IS_NUMBER,
		required: true,
		allownull: false
  },

};
