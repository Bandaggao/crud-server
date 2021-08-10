const TAG = '[Employee]';
const db = require('../core/database');
const logger = require('../core/logger');
const { response, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../core/response');


module.exports.getAll = () => {
  const ACTION = '[getAll]';
  logger.log('info', `${TAG}${ACTION}`);
  return new Promise((resolve, reject) => {
    db.execute(`SELECT * FROM employee_info`)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.create = employee => {
  const ACTION = '[create]';
  logger.log('info', `${TAG}${ACTION}`, { employee });
  return new Promise((resolve, reject) => {
    db.execute(`INSERT INTO employee_info SET ?`, employee)
      .then(data => {
        if (data.affectedRows > 0) {
          resolve();
        } else {
          reject(response(INTERNAL_SERVER_ERROR));
        }
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.updateByID = (id, employee) => {
  const ACTION = '[updateByID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`UPDATE employee_info SET ? WHERE id = ?`, [employee
  , id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.deleteByID = (id) => {
  const ACTION = '[updateByID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`DELETE FROM employee_info WHERE id = ?`, [id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

