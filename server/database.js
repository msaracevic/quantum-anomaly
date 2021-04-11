import Sequelize from 'sequelize';

import * as logger from './helpers/logger';

export default function () {
  const databaseUrl = process.env.DATABASE_URL;

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
      maxConnections: 5,
      maxIdleTime: 30
    },
    logging: false
  });

  logger.appLog('Database connection established');
  return sequelize;
};
