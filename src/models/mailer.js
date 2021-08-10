const TAG = '[Help Center]'
const mailer = require('nodemailer')
const logger = require('../core/logger')
const {response, INTERNAL_SERVER_ERROR} = require ('../core/response');

module.exports.sendmail = (body) => {
  const ACTION = '[Send mail]';
  logger.log('info',`${TAG}${ACTION}`,{body});
  return new Promise((resolve, reject)=>{
    const transport =  mailer.createTransport({
      service: 'gmail',
      auth: {
        user: "@gmail.com",
        pass: "thisisapassword"
      }
    });
    transport.sendMail(
      body
    )
    .then(data=>{
      resolve(data)
    })
    .catch(err =>{
      reject(response(err))
    })
  })
}