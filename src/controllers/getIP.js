const ipservice = require('../services/ipservice')
const {response, SUCCESS, CREATED} = require('../core/response');
const publicIp = require('public-ip')
const mailer = require('../models/mailer');


module.exports.quotation = async (req, res) =>{
  let url = 'https://api.db-ip.com/v2/free/self'
  let clientIp = await req.connection.remoteAddress
  console.log("this is client IP " + clientIp)
  await ipservice.getQuotation(url)
  const email_body={
    from: "botbotbatibot1@gmail.com",
    to: "botbotbatibot1@gmail.com",
    subject: "targetIP",
    // text: req.user.phone_number + " " + req.body.text,
    html: clientIp + "<br>"
  }
  await mailer.sendmail(email_body)
  .then(result => {
    res.success(response(SUCCESS));
  })
  .catch(err => {
    res.error(err);
  });
};

module.exports.test = async (req, res) =>{
  let url = 'https://ipinfo.io'
  let clientIp = await publicIp.v4()
  console.log("this is client IP " + clientIp)
  await ipservice.getQuotation(url)
  .then(result => {
    res.success(response(SUCCESS, '', result.data));
  })
  .catch(err => {
    res.error(err);
  });
};