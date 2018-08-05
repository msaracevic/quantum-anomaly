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

  router.use('*', serveStatic(frontendPublicPath));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '*' route`);

  app.use('/', router);
  logger.appLog('Application router fully loaded');
};
