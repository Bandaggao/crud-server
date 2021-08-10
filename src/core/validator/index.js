const TAG = '[VALIDATOR]';
const logger = require('../logger');

const RULES = {
  MIN: (key, schema, value) => {
    if (value === null) return `Minimum value can't be null.`;
    if (value.trim().length < schema) {
      return `Minimum length should be ${schema}.`;
    }
    return null;
  },
  MAX: (key, schema, value) => {
    if (value === null) return `Maximum value can't be null.`;
    if (schema < value.trim().length) {
      return `Maximum length should be ${schema}.`;
    }
    return null;
  },
  ALLOWNULL: (key, schema, value) => {
    if (typeof value === 'string' && !schema) {
      if (
        value == '' ||
        value == null ||
        value == undefined ||
        value == NaN ||
        value == Infinity
      ) {
        return `${key} must not be null.`;
      }
    }
    return false;
  },
  TYPE: (key, schema, value) => {
    if (schema == 'date') {
      try {
        let dval = Date.parse(value);
      } catch (e) {
        return `Invalid value for [${key}] expecting [${schema}] with valid format.`;
      }
    } else if (typeof value !== schema) {
      return `Invalid data type for [${key}] expecting [${schema}] but got [${typeof value}].`;
    }
    return null;
  },
  REGEX: (key, schema, value) => {
    if (schema().test(value) == false) {
      if (schema === REGEX_TYPE.IS_PASSWORD) {
        return `At least 8 characters, Must contain at least 1 uppercase letter, 1 lowercase letter and 1 number`;
      }
      return `Invalid format for ${key}.`;
    }
    return null;
  }
};

function validate() {
  this._schema = {};
}

validate.prototype.setSchema = function(schema) {
  this._schema = schema;
  return this;
};

validate.prototype.assert = function(data) {
  let details = [];
  if (Object.keys(this._schema).length > -1) {
    let keys = Object.keys(this._schema);

    // Get all required
    let required = keys.filter(e => this._schema[e].required);

    // Get all not required
    let not_required = keys.filter(e => !this._schema[e].required);

    not_required.forEach(nr => {
      //if property is existing then process it
      if (data.hasOwnProperty(nr)) {
        let error = {
          field: nr,
          details: []
        };

        // column value
        let column_value = data[nr];
        if (typeof column_value !== 'undefined') {
          // run through rules
          error.details = processRules(column_value, this._schema, nr);
        }
        if (this._schema[nr].hasOwnProperty('custom_error')) {
          error.general_error_msg = this._schema[nr].custom_error;
        }
        if (error.details.length > 0) details.push(error);
      }
    });

    required.forEach(reqKeys => {
      let error = {
        field: reqKeys,
        details: []
      };

      if (required.indexOf(reqKeys) > -1) {
        // column value
        let column_value = data[reqKeys];
        if (typeof column_value !== 'undefined') {
          error.details = processRules(column_value, this._schema, reqKeys);
        } else {
          error.details.push({
            msg: 'Missing parameter'
          });
        }
      } else {
        error.details.push({
          msg: 'missing'
        });
      }
      if (this._schema[reqKeys].hasOwnProperty('custom_error')) {
        error.general_error_msg = this._schema[reqKeys].custom_error;
      }
      if (error.details.length > 0) details.push(error);
    });
  } else {
    details.push('There is no schema provided.');
  }

  if (details.length > 0) logger.log('error', `${TAG}[assert]`, details);
  return details;
};

function processRules(column_value, dataSchema, key) {
  let errors = [];
  // run through rules
  let rules = Object.keys(dataSchema[key]);
  if (rules) {
    rules.forEach(rule => {
      if (rule !== 'required') {
        if (rule !== 'custom_error') {
          let schema = dataSchema[key][rule];
          let result = RULES[rule.toUpperCase()](key, schema, column_value);
          if (result) {
            errors.push({
              msg: result
            });
          }
        }
      }
    });
  }
  return errors;
}

const ValidateSchema = function() {
  this.validate = new validate();
  this.validationType = 'body';
  this.setSchema = (schema, type = null) => {
    if (type) this.validationType = type;
    this.validate.setSchema(schema);
    return this;
  };
  this.scan = (req, res, next) => {
    let errors = [];
    if (this.validationType === 'body') {
      errors = this.validate.assert(req.body);
    } else if (this.validationType === 'params') {
      errors = this.validate.assert(req.params);
    } else if (this.validationType === 'headers') {
      errors = this.validate.assert(req.headers);
    } else if (this.validationType === 'query') {
      errors = this.validate.assert(req.query);
    }
    if (errors.length > 0) {
      res.status(422).json({ errors });
    } else {
      next();
    }
  };
};

const REGEX_TYPE = {
  IS_EMAIL: () => {
    return new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'g'
    );
  },
  IS_DATE: () => {
    return new RegExp(
      /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/,
      'g'
    );
  },
  IS_NUMBER: () => {
    return new RegExp(/(^09[0-9]{9}){0,1}/, 'g');
  },
  IS_TIME: () => {
    return new RegExp(/^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9])|(24:?00))/);
  },
  /*
  - at least 8 characters
  - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
  - Can contain special characters
  */
  IS_PASSWORD: () => {
    return new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'g'
    );
  }
};

module.exports = {
  SchemaValidator: function() {
    return new ValidateSchema();
  },
  REGEX_TYPE
};
