const TAG = '[user]';
const bcrypt = require('bcrypt');
const db = require('../core/database');
const logger = require('../core/logger');
const { token, JWT_TYPE } = require('../core/jwt');
const {
  response,
  INVALID_CREDENTIALS,
  INTERNAL_SERVER_ERROR,
  INVALID_OLD_PASSWORD,
  ACCESS_ROLE_DENIED,
  NOT_FOUND,
  DATE_COMPARISON_ERROR,
  TOKEN_EXPIRED
} = require('../core/response');
// const { data } = require('../core/logger');

module.exports.create = user =>{
  const ACTION = '[Create]'
  logger.log('info', `${TAG}${ACTION}`,{user});
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO users set ?`, user)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(response(INTERNAL_SERVER_ERROR));
    });
  });
};

module.exports.addUserInfo = userInfo =>{
  const ACTION = '[AddUserInfo]'
  logger.log('info', `${TAG}${ACTION}`, userInfo);
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO retailer_info set ?`, userInfo)
      .then(data => {
        resolve(data)
      })
      .catch((err)=>{
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.addTDcode = tdcode =>{
  const ACTION = '[AddTDCode]'
  logger.log('info', `${TAG}${ACTION}`, tdcode);
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO distributor_td_code set ?`, tdcode)
      .then(data => {
        resolve(data)
      })
      .catch((err)=>{
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getByMobileNumber = (mobile_number) =>{
  const ACTION = '[findByMobileNumber]';
  logger.log('info', `${TAG}${ACTION}`, {mobile_number});
  return new Promise((resolve, reject)=>{
      db.execute(`
        SELECT * FROM users where mobile_number = ?
      `,mobile_number)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.updatePassword = (new_password, mobile_number) =>{
  const ACTION = '[UPDATE PASSWORD]'
  logger.log('info',`${TAG}${ACTION}`, {mobile_number});
  return new Promise((resolve, reject)=>{
    db.execute(`UPDATE users set password = ? where mobile_number = ? `,[new_password, mobile_number])
    .then(data => {
      resolve(data)
    })
    .catch(err => {
      reject(response(err))
    });
  });
};

module.exports.updateOTP = (mobile_number, otpCode) =>{
  const ACTION = '[UPDATE user otp and date]'
  logger.log('info',`${TAG}${ACTION}`, {mobile_number});
  return new Promise((resolve, reject)=>{
    db.execute(`UPDATE users set otp = ? where mobile_number = ? `,[otpCode, mobile_number])
    .then(data => {
      resolve(data)
    })
    .catch(err => {
      reject(response(err))
    });
  });
};

module.exports.verifyPasswordOtp = ( mobile_number, otp_code) => {
  const ACTION = '[login]';
  logger.log('info', `${TAG}${ACTION}`, { mobile_number });
  return new Promise((resolve, reject) => {
    db.execute(
      `SELECT * FROM users where mobile_number = ?`, mobile_number
    )
      .then(data => {
        if (data.length > 0) {
          let user = data[0];
          checkPasswordOTP(otp_code, user, resolve, reject);
        } else {
          reject(response(INVALID_CREDENTIALS));
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getByID = id => {
  const ACTION = '[getByID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`SELECT * FROM users WHERE id = ?`, id)
      .then(data => {
        if (data.length > 0) {
          resolve(data[0]);
        } else {
          reject(response(NOT_FOUND));
        }
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.login = (mobile_number, password) => {
  const ACTION = '[login]';
  logger.log('info', `${TAG}${ACTION}`, { mobile_number });
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT u.id, u.password AS 'password', Concat (ui.first_name, ' ', ui.last_name) 
      as name, u.mobile_number as phone_number, u.role AS 'role_id',ui.distributor_unique_id as 'distributor_code', ui.birthdate
      FROM users AS u 
      INNER JOIN retailer_info as ui ON u.id = ui.user_id
      WHERE u.mobile_number = ? AND u.is_enabled = 1;
      `,
      mobile_number
    )
      .then(data => {
        if (data.length > 0) {
          let user = data[0];
          checkPassword(password, user, resolve, reject);
        } else {
          reject(response(INVALID_CREDENTIALS));
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};



module.exports.verifyOtp = ( mobile_number, otp_code) => {
  const ACTION = '[login]';
  logger.log('info', `${TAG}${ACTION}`, { mobile_number });
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT r.user_id, r.retailer_activation_code AS 'activation_code',
      u.id, u.password AS 'password', u.role AS 'role_id',ui.distributor_unique_id as 'distributor_code'
      FROM retailer_info AS r
      INNER Join users as u on r.user_id = u.id
      INNER JOIN retailer_info as ui ON u.id = ui.user_id 
      WHERE r.mobile_number = ?;
      `,
      mobile_number
    )
      .then(data => {
        if (data.length > 0) {
          let user = data[0];
          checkOTP(otp_code, user, resolve, reject);
        } else {
          reject(response(INVALID_CREDENTIALS));
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};


module.exports.activateAccountByMobileNumber = (mobile_number) =>{
  const ACTION = '[findByMobileNumber]';
  logger.log('info', `${TAG}${ACTION}`, {mobile_number});
  return new Promise((resolve, reject)=>{
      db.execute(`
      update users set is_enabled = 1 where mobile_number = ?
      `,mobile_number)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.createAdmin = user =>{
  const ACTION = '[CreateDitributor]'
  logger.log('info', `${TAG}${ACTION}`,{user});
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO users set ?`, user)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(response(INTERNAL_SERVER_ERROR));
    });
  });
};

module.exports.createSuperUser = user =>{
  const ACTION = '[Create Super user]'
  logger.log('info', `${TAG}${ACTION}`,{user});
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO users set ?`, user)
    .then((data) =>{
      resolve(data);
    })
    .catch((err) => {
      reject(response(INTERNAL_SERVER_ERROR));
    });
  });
};

module.exports.addDistributorInfo = info =>{
  const ACTION = '[AddUserInfo]'
  logger.log('info', `${TAG}${ACTION}`, info);
  return new Promise((resolve, reject)=>{
    db.execute(`INSERT INTO distributor_info set ?`, info)
      .then(data => {
        resolve(data)
      })
      .catch((err)=>{
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getDisributorInfo = id => {
  const ACTION = '[get distributor info By ID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`SELECT u.id, d.distributor_name, d.contact_number, d.unique_id as unique_id, dt.td_code as tdCode, td.city, u.role AS 'role_id'
    FROM users AS u
    INNER JOIN distributor_info as d ON u.id = d.user_id
    INNER JOIN distributor_td_code as dt on u.id = dt.user_id
    INNER JOIN td_codes as td on dt.td_code = td.td_code
    WHERE u.id = ? AND u.is_enabled = 1`, id)
    .then(data => {
      let tdInfos= getUniquePropertyFromArray(data);
      for(const tdInfo of tdInfos){
        let td_codes =[];
        for(const td_code of data){
          if(tdInfo.id == td_code.id){
            td_codes.push({
              tdCode: td_code.tdCode,
            });
          }
        }
        tdInfo.td_codes = td_codes
      }
      console.log("------------RESULTS--------------");
      // console.log(td_codes);
      resolve(tdInfos)
      console.log(tdInfos)
    })
    .catch((err)=>{
      reject(response(INTERNAL_SERVER_ERROR));
    });
  });
};

function getUniquePropertyFromArray(data) {
  const result = [];
  const map = new Map();
  for (const distributorCode of data) {
    if (!map.has(distributorCode.id)) {
      map.set(distributorCode.id, true); // set any value to Map
      result.push({
        // tdCode: distributorCode.tdCode,
        id: distributorCode.id,
        distributor_name: distributorCode.distributor_name,
        contact_number:distributorCode.contact_number
      });
    }
  }
  return result;
}

module.exports.getretailerInfo = id => {
  const ACTION = '[get retailer info By ID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`
    SELECT u.id, r.first_name, r.last_name, r.mobile_number
    FROM users AS u 
    INNER JOIN retailer_info as r ON u.id = r.user_id
    WHERE u.id = ? AND u.is_enabled = 1`, id)
      .then(data => {
        if (data.length > 0) {
          resolve(data[0]);
        } else {
          reject(response(NOT_FOUND));
        }
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.loginAdmin = (mobile_number, password) => {
  const ACTION = '[login]';
  logger.log('info', `${TAG}${ACTION}`, { mobile_number });
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT u.id, d.unique_id as unique_id, u.password AS 'password', u.role AS 'role_id'
      FROM users AS u 
      INNER JOIN distributor_info as d ON u.id = d.user_id
      WHERE u.mobile_number = ? AND u.is_enabled = 1;
      `,
      mobile_number
    )
      .then(data => {
        if (data.length > 0) {
          let user = data[0];
          checkPassword(password, user, resolve, reject);
        } else {
          reject(response(INVALID_CREDENTIALS));
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.loginSuperUser = (mobile_number, password) => {
  const ACTION = '[login Super Admin]';
  logger.log('info', `${TAG}${ACTION}`, { mobile_number });
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT u.id, u.password AS 'password', u.role AS 'role_id'
      FROM users AS u 
      WHERE u.mobile_number = ? AND u.is_enabled = 1;
      `,
      mobile_number
    )
      .then(data => {
        if (data.length > 0) {
          let user = data[0];
          checkPassword(password, user, resolve, reject);
        } else {
          reject(response(INVALID_CREDENTIALS));
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.loginAsShopper = (emailaddress, password) => {
  const ACTION = '[loginAsShopper]';
  logger.log('info', `${TAG}${ACTION}`, { emailaddress });
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT agora_health.u.id, 
      agora_health.u.password AS 'password', 
      agora_health.u.phone as phone_number, 
      agora_health.u.profile_type as role
      FROM agora_health.users AS u 
      WHERE agora_health.u.email = ?
      `,
      emailaddress
    )
      .then(data => {
        if (data.length === 0) {
          reject(response(INVALID_CREDENTIALS));
        } else if(data[0].role != "Shopper") {
          reject(response(ACCESS_ROLE_DENIED));
        } else {
          let user = data[0];
          //this is due to types of bcrypt hashes $2y$ vs $2b$
          user.password = convertLaravelPasswordToNodejsPassword(user.password)
          checkPassword(password, user, resolve, reject);
        }
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getAllUsers = () => {
  const ACTION = '[getAllUsers]';
  logger.log('info', `${TAG}${ACTION}`, {});
  return new Promise((resolve, reject) => {
    db.execute(
      `
      SELECT u.id, Concat (ui.first_name, ' ', ui.last_name) as name, u.mobile_number as phone_number, u.role AS 'role_id',
      u.is_enabled, ui.distributor_unique_id as 'distributor_code', ui.birthdate
      FROM users AS u 
      INNER JOIN retailer_info as ui ON u.id = ui.user_id;
      `
    )
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.countUsersByDateRange = (startDate, endDate) => {
  const ACTION = '[countUsersByDateRange]';
  logger.log('info', `${TAG}${ACTION}`, {});
  return new Promise((resolve, reject) => {
    db.execute(queryCountAllDaysInDateRange(), [startDate, startDate, endDate])
      .then(data => {
        endDate < startDate ? reject(response(DATE_COMPARISON_ERROR)) : resolve(data)
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.sumUpAllDeliveredOrdersByDateRange = (startDate, endDate) => {
  const ACTION = '[sumUpAllDeliveredOrdersByDateRange]';
  logger.log('info', `${TAG}${ACTION}`, {});
  return new Promise((resolve, reject) => {
    db.execute(querySumUpAllDeliveredOrders(), [startDate, startDate, endDate])
      .then(data => {
        endDate < startDate ? reject(response(DATE_COMPARISON_ERROR)) : resolve(data)
      })
      .catch(error => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

function checkPassword(password, user, resolve, reject) {
  bcrypt
    .compare(password, user.password)
    .then(data => {
      if (data) {
        delete user.password;
        const tok = token.sign(JWT_TYPE.SSO, { user });
        resolve({ token: tok });
      } else {
        reject(response(INVALID_CREDENTIALS));
      }
    })
    .catch(error => {
      reject(response(INVALID_CREDENTIALS));
    });
}
function checkOTP(otp_code, user, resolve, reject) {
  bcrypt
    .compare(otp_code, user.activation_code)
    .then(data => {
      if (data) {
        delete user.activation_code;
        const tok = token.sign(JWT_TYPE.SSO, { user });
        resolve({ token: tok });
      } else {
        reject(response(INVALID_CREDENTIALS));
      }
    })
    .catch(error => {
      reject(response(INVALID_CREDENTIALS));
    });
}

function convertLaravelPasswordToNodejsPassword(pwd) {
  let splitPwd = pwd.split("");

  splitPwd[2] = "b";

  return splitPwd.join("");
}

function queryCountAllDaysInDateRange() {
  let query = `
  select date, count(agora_load.users.created_at) as user_count from (
    select date_add(?, INTERVAL n5.num*10000+n4.num*1000+n3.num*100+n2.num*10+n1.num DAY ) as date from
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n1,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n2,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n3,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n4,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n5
    ) a
    LEFT JOIN agora_load.users ON date(agora_load.users.created_at) = date
    where (date between ? and ?)
    group by date;
  `;

  return query;
}

function querySumUpAllDeliveredOrders() {
  let query= `
  select date, IFNULL(sum(agora_health.orders.total), 0) as total_orders from (
    select date_add(?, INTERVAL n5.num*10000+n4.num*1000+n3.num*100+n2.num*10+n1.num DAY ) as date from
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n1,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n2,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n3,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n4,
    (select 0 as num
       union all select 1
       union all select 2
       union all select 3
       union all select 4
       union all select 5
       union all select 6
       union all select 7
       union all select 8
       union all select 9) n5
    ) a
    LEFT JOIN agora_health.orders ON date(agora_health.orders.created_at) = date AND agora_health.orders.status="DELIVERED"
    where (date between ? and ?)
    group by date;
  `;

  return query;
}

function checkPasswordOTP(otp_code, user, resolve, reject) {
  bcrypt
    .compare(otp_code, user.otp)
    .then(data => {
      
      if (data) {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateToday = new Date(date+' '+time)
        let otpdate = new Date(user.otp_date)
        let diff = (dateToday.getTime() - otpdate.getTime()) / 1000
        if(diff > 60){
          reject(response(TOKEN_EXPIRED))
        }else{
          delete user.activation_code;
          const tok = token.sign(JWT_TYPE.SSO, { user });
          resolve({ token: tok });
        }
      } else {
        reject(response(INVALID_CREDENTIALS));
      }
    })
    .catch(error => {
      reject(response(INVALID_CREDENTIALS));
    });
}