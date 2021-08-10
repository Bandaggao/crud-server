const { response, SUCCESS, CREATED } = require('../core/response');
const Employee = require('../models/employee');

module.exports.create = (req, res) => {
  Employee.create(req.body)
    .then(result => {
      res.success(response(CREATED));
    })
    .catch(err => {
      res.error(err);
    });
};

module.exports.getAllEmployees = (req, res) => {
  Employee.getAll()
    .then(result => {
      return res.success(response(SUCCESS, '', result));
    })
    .catch(err => {
      res.error(err);
    });
};

module.exports.updateEmployeeByID = (req, res) => {
  Employee.updateByID(req.params.id, req.body)
  .then(result => {
    res.success(response(SUCCESS, '', result));
  })
  .catch(err => {
    res.error(err);
  });
};

module.exports.deleteEmployeeByID = (req, res) => {
  Employee.deleteByID(req.params.id)
  .then(result => {
    res.success(response(SUCCESS, '', result));
  })
  .catch(err => {
    res.error(err);
  });
};