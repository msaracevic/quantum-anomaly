const env = process.env.NODE_ENV || 'development';

import express from 'express';
import multer from 'multer';
import path from 'path';
import serveStatic from 'serve-static';

import * as logger from '../helpers/logger';
import {ensureAuthenticated} from '../middleware/auth';

import * as epicArcs from './epic-arcs';
import * as incursions from './incursions';
import * as eveFittingSimulator from './eve-fitting-simulator';
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
  router.use('/api/warframe', warframeStatus.getWarframeStatus);

  router.use('/api/eve-fitting-simulator/group', eveFittingSimulator.getShipGroup);
  router.use('/api/eve-fitting-simulator/groups', eveFittingSimulator.getShipGroups);
  router.use('/api/eve-fitting-simulator/ship', eveFittingSimulator.getShip);

  // for time being, poor flag until we get user roles setup (to enable these
  // routes, flip the env variable on server)
  if (process.env.ESI_UPDATES_ENABLED === 'true') {
    router.use('/tasks/update/:type', tasks.getData);
    router.use('/tasks/update-nulled/:type', tasks.updateData);
    router.use('/tasks/generateShips', tasks.generateShips);
    logger.appWarning('ESI tasks routes are loaded', 'red');
  }


  router.use('*', serveStatic(frontendPublicPath));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '*' route`);

  app.use('/', router);
  logger.appLog('Application router fully loaded');
};
