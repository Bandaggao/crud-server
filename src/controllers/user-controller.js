const bcrypt = require("bcrypt");
const { token, JWT_TYPE } = require("../core/jwt");
const User = require("../models/user");
const sms = require("../models/sms");
const {
  response,
  SUCCESS,
  CREATED,
  MOBILE_NUMBER_EXISTS,
  MOBILE_NUMBER_NOT_FOUND,
} = require("../core/response");

module.exports.create = async (req, res)=>{
  const otp_code = Math.floor(100000 + Math.random() * 900000);
  var otp_to_encrypt = otp_code.toString();
  // otp_to_encrypt.toString
  const userData = {
    mobile_number: req.body.mobile_number,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role
  }
  // userData.staus = 1;
  // userData.password = bcrypt.hashSync(req.body.password, 10);
  try {
    const encrytedOTP = bcrypt.hashSync(otp_to_encrypt, 10)
    const u = await User.getByMobileNumber(req.body.mobile_number, req.body.role);
    if(u.length === 0){
      const result = await User.create(userData);
      const userInfo={
        user_id: result.insertId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.mobile_number,
        account_status:"1",
        // distributor_unique_Id : req.body.distributor_unique_Id,
        // is_enable:"1",
        retailer_activation_code:encrytedOTP
        // city: req.body.city

      }
      // console.log(otp_to_encrypt)
      // console.log(otp_code)
      await User.addUserInfo(userInfo);
      message = "Please use this code to activate your account " + otp_code
      await sms.sendMessage(req.body.mobile_number, message)
      res.success(response(CREATED));
    } else {
      res.error(response(MOBILE_NUMBER_EXISTS))
    }
  }catch (err){
    res.error(err)
  }
};

module.exports.getOtp = async (req, res) => {
  try {
    let u =  await User.getByMobileNumber(req.body.mobile_number)
    if (u.length !== 0){
     const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
     const encrytedOTP = bcrypt.hashSync(otp_code, 10)
     await User.updateOTP(req.body.mobile_number, encrytedOTP)
     message = "Please use this code to update password " + otp_code
     await sms.sendMessage(req.body.mobile_number, message)
     res.success(response(SUCCESS));
    }else{
      res.error(response(MOBILE_NUMBER_NOT_FOUND))
    }
  } catch (error) {
    res.error(error)
  };
};

module.exports.verifyOTP = async (req, res) => {
  const {otp_code, mobile_number } = req.body;
  try {
    const result = await User.verifyPasswordOtp(mobile_number, otp_code);
    res.success(response(SUCCESS, '', result));
  } catch (error) {
    res.error(error);
  }
};

module.exports.updatePassword = (req, res) => {
  User.updatePassword(bcrypt.hashSync(req.body.password, 10), req.body.mobile_number)
  .then(result => {
    res.success(response(SUCCESS))
  })
  .catch(err => {
    res.error(err)
  })
}

module.exports.createSuperUser = (req, res) =>{
  const userData = {
    mobile_number: req.body.mobile_number,
    password: bcrypt.hashSync(req.body.password, 10),
    role: 2,
    is_enabled : 1,
  }
  User.createSuperUser(userData)
  .then(result => {
    res.success(response(CREATED));
  })
  .catch(err => {
    res.error(err);
  });
};

module.exports.createAdmin = async (req, res)=>{
  //const TDcode = Math.floor(100000 + Math.random() * 900000);
  // var otp_to_encrypt = otp_code.toString();
  // otp_to_encrypt.toString
  const userData = {
    mobile_number: req.body.mobile_number,
    password: bcrypt.hashSync(req.body.password, 10),
    role: 1,
    is_enabled : 1,
  }
  // userData.staus = 1;
  // userData.password = bcrypt.hashSync(req.body.password, 10);
  try {
    // const encrytedOTP = bcrypt.hashSync(otp_to_encrypt, 10)
    const u = await User.getByMobileNumber(req.body.mobile_number, req.body.role);
    if(u.length === 0){
      const result = await User.createAdmin(userData);
      const td_code_info={
        user_id: result.insertId,
        td_code : req.body.unique_id
      }
      const userInfo={
        user_id: result.insertId,
        distributor_name : req.body.distributor_name,
        unique_id : req.body.unique_id,
        city : req.body.city,
        // account_status:"1",
        contact_number : req.body.mobile_number
        // is_enable:"1",
        // city: req.body.city

      }
      // console.log(otp_to_encrypt)
      // console.log(otp_code)
      await User.addDistributorInfo(userInfo);
      await User.addTDcode(td_code_info)
      res.success(response(CREATED));
    } else {
      res.error(response(MOBILE_NUMBER_EXISTS))
    }
  }catch (err){
    res.error(err)
  }
};

module.exports.addDstributorCode = (req, res) => {
  const tdCodeInfo = {
    user_id : req.user.id,
    td_code : req.body.td_code
  }
  User.addTDcode(tdCodeInfo)
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};


module.exports.getDistributorInfoById = (req, res) => {
  User.getDisributorInfo(req.user.id)
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};

module.exports.getRetailerInfoById = (req, res) => {
  User.getretailerInfo(req.user.id)
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};

module.exports.getAllUsers = (req, res) => {
  User.getAllUsers()
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};

module.exports.countUsersByDateRange = (req, res) => {
  User.countUsersByDateRange(req.body.startDate, req.body.endDate)
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};

module.exports.sumUpAllDeliveredOrdersByDateRange = (req, res) => {
  User.sumUpAllDeliveredOrdersByDateRange(req.body.startDate, req.body.endDate)
    .then((result) => {
      res.success(response(SUCCESS, "", result));
    })
    .catch((err) => {
      res.error(err);
    });
};