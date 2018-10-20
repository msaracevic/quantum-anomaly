const env = process.env.NODE_ENV || 'development';
import dotenv from 'dotenv';
if (env === 'development') dotenv.config();

import Sequelize from 'sequelize';

import ships from './ships';
import skills from './skills';
import incursion from './incursions';
import * as logger from '../../helpers/logger';

function startMigration() {
  let rowsAdded = 0;

  const eveSequelize = new Sequelize(process.env.EVE_DATABASE_URL, {logging: false});
  logger.appLog('EVE Database connection established');

  let sequelize;

  if (process.env.UPDATE_LIVE === 'true') {
    sequelize = new Sequelize(process.env.DATABASE_URL_LIVE, {
      logging:        false,
      dialect:        'postgres',
      protocol:       'postgres',
      dialectOptions: {
        ssl: true
      },
      pool:           {
        max:     10,
        min:     1,
        idle:    50000,
        acquire: 20000
      }
    });
    logger.appLog('Database connection established');
    logger.log('YOU ARE CONNECTED TO LIVE DATABASE, BETTER NOT MESS THIS UP!', ['access'], 'red');
  } else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});
    logger.appLog('Database connection established');
  }

  ships(eveSequelize, sequelize)
    .then(shipsNumber => rowsAdded += shipsNumber)
    .then(() => skills(eveSequelize, sequelize))
    .then(skillsNumber => rowsAdded += skillsNumber)
    .then(() => incursion(eveSequelize, sequelize))
    .then((incursionMapNumber) => rowsAdded += incursionMapNumber)
    .then(() => {
      logger.action('Number of rows added: ' + rowsAdded, ['access'], 'yellow');
      process.exit(0);
    });
}

startMigration();
