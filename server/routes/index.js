const env = process.env.NODE_ENV || 'development';

import express from 'express';
import multer from 'multer';
import path from 'path';
import serveStatic from 'serve-static';

import {ensureAuthenticated} from '../middleware/auth';
import * as logger from '../helpers/logger';

import * as x4 from './x4';

import * as admin from './admin';
import * as epicArcs from './epic-arcs';
import * as incursions from './incursions';
import * as eveFittingSimulator from './eve-fitting-simulator';
import * as eveNpcs from './eve-npcs';
import * as tasks from './tasks';

const router = express.Router(),
  upload = multer({dest: 'uploads/'}),
  root = env === 'production' ? path.join(__dirname, '..', '..') : path.join(__dirname, '..');

export default function (app) {
  const frontendPublicPath = path.join(root, '..', 'frontend', 'build');

  router.use('/', serveStatic(frontendPublicPath));
  router.use('/robots.txt', serveStatic(path.join(frontendPublicPath, 'robots.txt')));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '/' route`);

  router.use('/api/epic-arcs/info', epicArcs.getInfo);
  router.use('/api/epic-arcs/:faction', epicArcs.getEpicArc);

  router.get('/api/npcs/index', eveNpcs.getList);
  router.get('/api/npcs/:indices', eveNpcs.getNpcByIndex);
  router.get('/api/npcs/', eveNpcs.getNpcs);

  router.get('/api/x4/ships', x4.getShips);
  router.get('/api/x4/equipment', x4.getEquipment);
  router.get('/api/x4/map', x4.getMap);

  router.use('/api/get-incursions', incursions.getIncursions);

  router.use('/api/eve-fitting-simulator/group', eveFittingSimulator.getShipGroup);
  router.use('/api/eve-fitting-simulator/groups', eveFittingSimulator.getShipGroups);
  router.use('/api/eve-fitting-simulator/ship', eveFittingSimulator.getShip);
  router.use('/api/eve-fitting-simulator/module-groups', eveFittingSimulator.getModuleGroups);
  router.use('/api/eve-fitting-simulator/module-group', eveFittingSimulator.getModuleGroup);
  router.use('/api/eve-fitting-simulator/dogma', eveFittingSimulator.getDogma);

  router.use('/admin/esi/information', ensureAuthenticated, admin.getEsiInformation);
  router.use('/admin/esi/running-job', ensureAuthenticated, admin.getCurrentJob);
  router.use('/admin/esi/fetch-endpoints', ensureAuthenticated, admin.fetchEndpoints);
  router.use('/admin/esi/update-endpoints', ensureAuthenticated, admin.updateEndpoints);

  // for time being, poor flag until we get user roles setup (to enable these
  // routes, flip the env variable on server)
  if (process.env.ESI_UPDATES_ENABLED === 'true') {
    router.use('/tasks/generate/all', tasks.generateAll);
    router.use('/tasks/generate/market', tasks.generateMarket);
    router.use('/tasks/generate/npc', tasks.generateNpcs);
    logger.appWarning('ESI tasks routes are loaded', 'red');
  }

  router.use('*', serveStatic(frontendPublicPath));
  logger.appLog(`React build files from ${frontendPublicPath} loaded on '*' route`);

  app.use('/', router);
  logger.appLog('Application router fully loaded');
};
