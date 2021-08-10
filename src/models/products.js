const TAG = '[Product]';
const db = require('../core/database');
const ajax = require('../services/Ajax');
const db2 = require('../core/database/healthDB.js');
const logger = require('../core/logger');
const Error = require('../services/Errors');
const { response, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../core/response');
const dbconfig = require('../config/dbconfig');
const getProductByCategoryURL = process.env.API_URL+"/app/product-category";

let unixtime = Date.now();
let currentDateTime = new Date(unixtime);
let merchantID=79;


module.exports.getAll = (branch_id) => {
  const ACTION = '[getAll]';
  logger.log('info', `${TAG}${ACTION}`, );
  return new Promise((resolve, reject) => {
    // db.execute(`SELECT * FROM products WHERE merchant_id = 79`)
    db.execute(`SELECT AHP.*, 
    AHPC.id AS category_id, 
    AHPC.name AS category_name, 
    AHPC.photo AS category_photo 
    FROM agora_health.product_product_categories as AHPP
    RIGHT JOIN agora_health.products as AHP ON AHPP.product_id = AHP.id 
    LEFT JOIN agora_health.product_categories as AHPC ON AHPP.category_id = AHPC.id 
    WHERE AHP.merchant_id = ?`, [branch_id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.create = product => {
  const ACTION = '[create]';
  logger.log('info', `${TAG}${ACTION}`, { product });
  return new Promise((resolve, reject) => {
    db.execute(`INSERT INTO agora_health.products SET ?, agora_health.products.created_at = ?, agora_health.products.merchant_id = ?`,[ 
      product, currentDateTime, merchantID])
      .then(data => {
        if (data.affectedRows > 0) {
          resolve(data.insertId);
        } else {
          reject(response(INTERNAL_SERVER_ERROR));
        }
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.updateByID = (id, product) => {
  const ACTION = '[updateByID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`UPDATE agora_health.products SET ? WHERE agora_health.products.id = ?`, [product
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
    db.execute(`DELETE FROM agora_heaalth.products WHERE id = ?`, [id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getByID = (id, product) => {
  const ACTION = '[getByID]';
  logger.log('info', `${TAG}${ACTION}`, id);
  return new Promise((resolve, reject) => {
    db.execute(`SELECT * FROM agora_health.products WHERE id = ?`, [id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getMerchantStocks= (merchant_id,) => {
  const ACTION = '[getByID]';
  logger.log('info', `${TAG}${ACTION}`, merchant_id);
  return new Promise((resolve, reject) => {
    db.execute(`SELECT id as "product_id", name as "product_name", unit, price,  stock FROM agora_health.products as ahp WHERE ahp.merchant_id = ?`, [merchant_id])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getByCategoryID = (categoryId,merchantId,token) => {
  const ACTION = '[getCategoryByID]';
  const uri = `${getProductByCategoryURL}/${categoryId}/product?merchant_id=${merchantId}`;
  logger.log('info', `${TAG}${ACTION}`, categoryId);
  return new Promise((resolve, reject) => {
    ajax
      .setOptions({
        uri,
        headers: {
          'Authorization': `Bearer ${token}`
        },  
      })
      .get()
      .then(res => {
        logger.log('info', `${TAG}${ACTION} - result`, res.body);
        const body = JSON.parse(res.body);
        if (!body.error) {
          resolve(body);
        }
        else {
          reject({
            status: 200,
            error: body
          });
        }
      })
      .catch(err => {
        logger.log('error', TAG + ACTION, err);
        reject(Error.raise('INTERNAL_SERVER_ERROR', err));
      });
  });
};

module.exports.getByFeaturedID = (isfeatured, isbestseller, lat, lng, distance, merchantcategory) => {
  const ACTION = '[getFeaturedByID]';
  logger.log('info', `${TAG}${ACTION}`, merchantcategory);
  return new Promise((resolve, reject) => {
    db.execute(queryEitherFeatureOrBestSeller(isfeatured, isbestseller, lat, lng, distance, merchantcategory))
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

module.exports.getBySearch = (str) => {
  const ACTION = '[getBySearch]';
  logger.log('info', `${TAG}${ACTION}`, str);
  //need to excute in db: ALTER TABLE `table_name` ADD FULLTEXT(`existing_col_name1`,`existing_col_name2`);
  //in this case: ALTER TABLE products ADD FULLTEXT(`name`, `details`); in order MATCH syntax work
  return new Promise((resolve, reject) => {
    db2.connect()
    .then(data => data)
    .catch(error => error);

    // db2.execute(`SELECT products.*, 
    // product_categories.id AS category_id, 
    // product_categories.name AS category_name, 
    // product_categories.photo AS category_photo 
    // FROM product_product_categories 
    // INNER JOIN products ON product_product_categories.product_id = products.id 
    // INNER JOIN product_categories ON product_product_categories.category_id = product_categories.id 
    // WHERE products.merchant_id = ? AND MATCH(products.name, products.details) AGAINST(? IN NATURAL LANGUAGE MODE)`, [branch_id, str])
    db2.execute(`SELECT products.*, 
    product_categories.id AS category_id, 
    product_categories.name AS category_name, 
    product_categories.photo AS category_photo,
    merchants.name AS merchant_name 
    FROM product_product_categories 
    INNER JOIN products ON product_product_categories.product_id = products.id 
    INNER JOIN merchants ON products.merchant_id = merchants.id 
    INNER JOIN product_categories ON product_product_categories.category_id = product_categories.id 
    WHERE (products.name LIKE '%${str}%' OR products.details LIKE '%${str}%' OR merchants.name LIKE '%${str}%')`)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(response(INTERNAL_SERVER_ERROR));
      });
  });
};

function queryEitherFeatureOrBestSeller(isfeatured, isbestseller, lat, lng, dist, merchantcategory) {
  merchantcategory ? 
  query = `SELECT ahp.*, ahm.logo as merchant_logo, ahm.name as merchant_name,
  ahm.address as merchant_address,
  ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( ahm.latitude ) ) * 
  cos( radians( ahm.longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) * 
  sin( radians( latitude ) ) ) ) AS distance
  FROM agora_health.products as ahp 
  INNER JOIN agora_health.merchants as ahm 
  ON ahp.merchant_id = ahm.id 
  WHERE ahp.merchantcategory= '${merchantcategory}' AND ` 
  :
  query = `SELECT ahp.*, ahm.logo as merchant_logo, ahm.name as merchant_name,
  ahm.address as merchant_address,
  ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( ahm.latitude ) ) * 
  cos( radians( ahm.longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) * 
  sin( radians( latitude ) ) ) ) AS distance
  FROM agora_health.products as ahp 
  INNER JOIN agora_health.merchants as ahm 
  ON ahp.merchant_id = ahm.id WHERE `

  if(isfeatured && isbestseller) {    
    query += `(ahp.isFeatured=${isfeatured} and ahp.isBestSeller = ${isbestseller}) HAVING distance <= ${dist}`
  }else if(isfeatured){
    query += `(ahp.isFeatured=${isfeatured}) HAVING distance <= ${dist}`
  }else {    
    query += `(ahp.isBestSeller = ${isbestseller}) HAVING distance <= ${dist}`
  }  
  return query
} 