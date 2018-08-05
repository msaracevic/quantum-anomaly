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

import eveInvTypesModel from './eveInvTypes';
import eveMarketGroupsModel from './eveMarketGroups';
import eveShipsModel from './eveShips';
import eveShipTypesModel from './eveShipTypes';

function overwriteEntry(error, response, Model) {
  if (error) return;
  let data = JSON.parse(response.body);
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
    EveInvTypes:     eveInvTypesModel(sequelize),
    EveMarketGroups: eveMarketGroupsModel(sequelize),
    EveShips:   eveShipsModel(sequelize),
    EveShipTypes:    eveShipTypesModel(sequelize),
    Sessions:        sessionsModel(sequelize),
    Users:           usersModel(sequelize),
    Ships:           shipsModel(sequelize),
    Skills:          skillsModel(sequelize),
    IncursionMaps:   incursionMapModel(sequelize),
    Incursions:      incursionsModel(sequelize),
    WarframeStatus:  warframeStatusModel(sequelize)
  };

  return sequelize.sync().then(() => {
    if (!silent) logger.appLog('Database models synced');
    updateEntry(models.Incursions, 'incursions', 10);
    updateEntry(models.WarframeStatus, 'warframeStatus', 3);
    return models;
  });
};

export {models};
