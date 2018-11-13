import Sequelize from 'sequelize';
import * as logger from '../helpers/logger';
import * as helpers from '../helpers';

import sessionsModel from './sessions';
import usersModel from './users';
import shipsModel from './ships';
import skillsModel from './skills';
import incursionMapModel from './incursion-map';
import incursionsModel from './incursions';
import warframeStatusModel from './warframe-status';

// Data which get filled from EVE API
import eveTypesModel from './eveTypes';
import eveGroupsModel from './eveGroups';
import eveDogmaAttributesModel from './eveDogmaAttributes';
import eveDogmaEffectsModel from './eveDogmaEffects';

// Custom data which gets created afterwards
import eveShipsModel from './eveShips';
import eveShipGroupsModel from './eveShipGroups';
import eveModulesModel from './eveModules';
import eveModuleGroupsModel from './eveModuleGroups';

function overwriteEntry(error, response, Model) {
  if (error) return;
  let data;
  try {
    data = JSON.parse(response.body);
  } catch (e) {
    logger.error('Response could not be parsed');
    return;
  }
  if (data.error) {
    logger.error(`Request was successful, but incoming data has error:  ${data.error}`);
    return;
  }

  Model.create({
    data: JSON.parse(response.body)
  }).then(function (data) {
    Model.destroy({
      where: {
        id: {
          [Sequelize.Op.ne]: data.get('id')
        }
      }
    });
  });
}

function updateEntry(Model, modelName, timer) {
  const urls = {
    incursions:     'https://esi.tech.ccp.is/latest/incursions/?datasource=tranquility',
    warframeStatus: 'http://content.warframe.com/dynamic/worldState.php'
  };

  helpers.request({url: urls[modelName]}, overwriteEntry, Model);
  setInterval(function () {
    helpers.request({url: urls[modelName]}, overwriteEntry, Model);
  }, timer * 60 * 1000);
  logger.appLog(`Model ${modelName} started autoupdate every ${timer} minutes`, 'gray');
}

let models = {};

export default function (sequelize, silent) {
  models = {
    EveTypes:           eveTypesModel(sequelize),
    EveGroups:          eveGroupsModel(sequelize),
    EveDogmaAttributes: eveDogmaAttributesModel(sequelize),
    EveDogmaEffects:    eveDogmaEffectsModel(sequelize),
    EveShips:           eveShipsModel(sequelize),
    EveShipGroups:      eveShipGroupsModel(sequelize),
    EveModules:         eveModulesModel(sequelize),
    EveModuleGroups:    eveModuleGroupsModel(sequelize),
    Sessions:           sessionsModel(sequelize),
    Users:              usersModel(sequelize),
    Ships:              shipsModel(sequelize),
    Skills:             skillsModel(sequelize),
    IncursionMaps:      incursionMapModel(sequelize),
    Incursions:         incursionsModel(sequelize),
    WarframeStatus:     warframeStatusModel(sequelize)
  };

  return sequelize.sync().then(() => {
    if (!silent) logger.appLog('Database models synced');
    updateEntry(models.Incursions, 'incursions', 10);
    updateEntry(models.WarframeStatus, 'warframeStatus', 3);
    return models;
  });
};

export {models};
