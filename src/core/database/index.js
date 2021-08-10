const TAG = '[DB]';
const mysql = require('mysql');
const logger = require('../logger');
const { db } = require('../../config');

/* for localhost mysql database */
const config = db;

if (process.env.DB_SSL === 'true') {
  Object.assign({}, config, { ssl: db.sslKey });
}

const state = {
  pool: null
};

module.exports.connect = function(done) {
  let pool_options = {
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.name,
    port: config.port,
    multipleStatements: true
  };

  if (config.ssl) {
    pool_options = {
      ...pool_options,
      ssl: {
        ca: config.ssl
      }
    };
  }

  state.pool = mysql.createPool(pool_options);

  return new Promise((resolve, reject) => {
    let conn = execute('Select version()', []);
    conn
      .then(data => {
        logger.log('info', `${TAG}[connect]`, data);
        resolve(data);
      })
      .catch(error => {
        logger.log('error', `${TAG}[connect]`, error);
        reject(error);
      });
  });
};

module.exports.get = function(callback) {
  return state.pool;
};

function execute(sql, param) {
  return new Promise((resolve, reject) => {
    state.pool.getConnection(function(error, connection) {
      if (error) {
        logger.log('error', `${TAG}[execute]`, error);
        reject(error);
      } else {
        const query = connection.query(sql, param, function(err, rows) {
          connection.release();
          if (!err) {
            let data = JSON.parse(JSON.stringify(rows));
            // Mask if password field was found
            if (Array.isArray(data) && data.length > 0) {
              if (data[0].hasOwnProperty('password')) {
                logger.log('info', `${TAG}[execute]`, {
                  ...data[0],
                  password: '********'
                });  
              } else {
                logger.log('info', `${TAG}[execute]`, data);
              }
            }
            resolve(data);
          } else {
            logger.log('error', `${TAG}[execute]`, err);
            reject(err);
          }
        });
        logger.log('info', `${TAG}[sql]`, query.sql);

        connection.on('error', function(err) {
          connection.release();
          logger.log('error', `${TAG}[execute]`, err);
          reject(err);
        });
      }
    });
  });
}

module.exports.execute = execute;
