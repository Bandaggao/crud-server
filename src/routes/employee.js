const router = require('express').Router();
const employeeController = require('../controllers/employee-controller');
const { SchemaValidator } = require('../core/validator');
const employeeSchema = require('../validators/employee-schema');



router.get('/', 
employeeController.getAllEmployees);

router.post(
  '/',
  SchemaValidator().setSchema(employeeSchema).scan,
  employeeController.create
);

router.put(
  '/:id',
  SchemaValidator().setSchema(employeeSchema).scan,
  employeeController.updateEmployeeByID
);

router.delete('/:id', 
employeeController.deleteEmployeeByID);

module.exports = router;