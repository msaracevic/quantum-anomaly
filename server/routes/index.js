const env = process.env.NODE_ENV || 'development';

import express from 'express';
import multer from 'multer';
import path from 'path';
import serveStatic from 'serve-static';

import * as logger from '../helpers/logger';
import {ensureAuthenticated} from '../middleware/auth';

import * as epicArcs from './epic-arcs';
import * as incursions from './incursions';
import * as eveFitting from './efs';
import * as tasks from './tasks';
import * as warframeStatus from './warframe';

const router = express.Router(),
      upload = multer({dest: 'uploads/'}),
      root   = env === 'production' ? path.join(__dirname, '..', '..') : path.join(__dirname, '..');

export default function (app) {
  const frontendPublicPath = path.join(root, '..', 'frontend', 'build');

  router.use('/', serveStatic(frontendPublicPath));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '/' route`);

  router.use('/api/get-epic-arcs', epicArcs.getEpicArcs);
  router.use('/api/get-incursions', incursions.getIncursions);
  router.use('/api/get-all-ships', eveFitting.getAllShips);
  router.use('/api/get-all-skills', eveFitting.getAllSkills);
  router.use('/api/warframe', warframeStatus.getWarframeStatus);

  // for time being, poor flag until we get user roles setup (to enable these
  // routes, flip the env variable on server)
  if (process.env.ESI_UPDATES_ENABLED === 'true') {
    router.use('/tasks/generateShips', tasks.generateShips);
    router.use('/tasks/updateMarket', tasks.updateMarket);
    router.use('/tasks/updateMarketNull', tasks.updateMarketNull);
    router.use('/tasks/updateInventory', tasks.updateInventory);
    router.use('/tasks/updateInventoryNull', tasks.updateInventoryNull);
    logger.appWarning('ESI tasks routes are loaded', 'red');
  }


  router.use('*', serveStatic(frontendPublicPath));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '*' route`);

  app.use('/', router);
  logger.appLog('Application router fully loaded');
};
