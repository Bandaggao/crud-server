// const { REGEX_TYPE } = require('../core/validator');

 module.exports = {
//   email: {
//     type: 'string',
//     regex: REGEX_TYPE.IS_EMAIL,
//     required: true,
//     allownull: false
//   },
//   password: {
//     type: 'string',
//     allownull: false,
//     required: false
//   },
   unique_id: {
     type: 'string',
     // max: 25,
     required: true,
     allownull: false
   }
//   // middlename: {
//   //   type: 'string',
//   //   min: 3,
//   //   max: 25,
//   //   required: false,
//   //   allownull: true
//   // },
//   lastname: {
//     type: 'string',
//     min: 3,
//     max: 25,
//     required: true,
//     allownull: false
//   },
//   firstname: {
//     type: 'string',
//     min: 3,
//     max: 25,
//     required: true,
//     allownull: false
//   },
//   role_id: {
//     type: 'number',
//     regex: REGEX_TYPE.IS_NUMBER,
//     required: true,
//     allownull: false
//   }
 };
