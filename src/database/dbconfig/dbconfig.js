const configs = require('../../appconfigs/config')();

require('dotenv').config();

module.exports = {
  development: {
    url: configs.devDatabaseUrl,
    dialect: 'postgres',
  },
  test: {
    url: configs.testDatabaseUrl,
    dialect: 'postgres',
  },
  production: {
    url: configs.prodDatabaseUrl,
    dialect: 'postgres',
  },
};
