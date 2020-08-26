const Joi = require('@hapi/joi');
require('dotenv').config();

function configs() {
  const values = ['development', 'production', 'test', 'provision'];
  const envVarsSchema = Joi.object({

    NODE_ENV: Joi.string()
      .allow(...values)
      .default('development'),
    SERVER_PORT: Joi.number()
      .default(4040),
    JWT_SECRET: Joi.string().required()
      .description('JWT Secret required to sign'),
    DEV_DATABASE_URL: Joi.string().required()
      .description('Postgres DB url'),
    TEST_DATABASE_URL: Joi.string().required()
      .description('Postgres DB url'),
    PROD_DATABASE_URL: Joi.string().required()
      .description('Postgres DB url'),
    SESSION_SECRET: Joi.string().required()
      .description('Session secret required'),
  }).unknown()
    .required();

  const { error, value: envVars } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  const config = {
    env: envVars.NODE_ENV,
    port: envVars.SERVER_PORT,
    jwtSecret: envVars.JWT_SECRET,
    sessionSecret: envVars.SESSION_SECRET,
    devDatabaseUrl: envVars.DEV_DATABASE_URL,
    prodDatabaseUrl: envVars.PROD_DATABASE_URL,
    testDatabaseUrl: envVars.TEST_DATABASE_URL,
  };
  return config;
}

module.exports = configs;
