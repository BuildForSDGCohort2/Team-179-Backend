/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * sequelize database ORM for PostgreSQL.
 *
 * @see https://sequelize.org/
 * @copyright 2020-present Team-179-Group-A
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const envConfigs = require('../dbconfig/dbconfig');
const configs = require('../../appconfigs/config')();

const basename = path.basename(__filename);
const { env } = configs;
const config = envConfigs[env];
const db = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    // const model = sequelize.import(path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
