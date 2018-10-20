import Sequelize from 'sequelize';

import * as logger from '../../helpers/logger';
import incursionTypes from './static-assets/incursion-types';

const TYPE_SELECT = {type: Sequelize.QueryTypes.SELECT};

function getStations(sequelize) {
  const query = 'SELECT * FROM "staStations";';

  // Take this as granted, this is list of ID with repairs
  const operationIDWithRepairs = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    14, 15, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30, 32, 33, 37,
    38, 39, 40, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55];

  return sequelize.query(query, TYPE_SELECT)
    .then(stations => {
      const stationsData = {};
      stations.forEach(station => {
        if (!stationsData[station.constellationID]) stationsData[station.constellationID] = {};
        if (!stationsData[station.constellationID][station.solarSystemID]) stationsData[station.constellationID][station.solarSystemID] = [];
        stationsData[station.constellationID][station.solarSystemID].push({
          stationID:   station.stationID,
          stationName: station.stationName,
          operationID: station.operationID,
          hasRepairs:  operationIDWithRepairs.indexOf(station.operationID) !== -1
        });
      });
      logger.action(`Grabbed data for ${stations.length} stations`);
      return stationsData;
    });
}

function getStationsInSystem(stationsData, constellationID, solarSystemID) {
  if (!stationsData[constellationID]) return [];
  else if (!stationsData[constellationID][solarSystemID]) return [];
  return stationsData[constellationID][solarSystemID];
}

function mapSystemsToConstellations(incursionMap, stations, sequelize) {
  const query = 'SELECT "solarSystemID", "solarSystemName", "radius", "security", "constellationID" ' +
    'FROM "mapSolarSystems" ';

  let numberOfSystems = 0;

  return Promise.all(incursionMap.map(constellation =>
      sequelize.query(`${query} WHERE "constellationID"=${constellation.constellationID}`, TYPE_SELECT)
        .then(systems => {
          constellation.systems = systems.map(system => {
            numberOfSystems++;
            system.radius        = (system.radius / 149597870700).toFixed(1);
            system.security      = system.security.toFixed(1);
            system.hasRepairs    = false;
            system.stations      = getStationsInSystem(stations, constellation.constellationID, system.solarSystemID);
            system.incursionType = incursionTypes(system.solarSystemID) || 'N/A';
            return system;
          });
        })
    ))
    .then(() => {
      logger.action(`Grabbed data for systems and mapped ${numberOfSystems} systems to constellations`);
      return incursionMap;
    });
}

function getConstellations(sequelize) {
  const query = 'SELECT "mapConstellations"."constellationID", "mapConstellations"."constellationName", ' +
    '"chrFactions"."factionName", "chrFactions"."factionID" ' +
    'FROM "mapConstellations" ' +
    'LEFT JOIN "chrFactions" ON "mapConstellations"."factionID" = "chrFactions"."factionID";';

  return sequelize.query(query, TYPE_SELECT).then(constellations => {
    logger.action(`Grabbed data for ${constellations.length} constellations`);
    return constellations;
  });
}

export default function (eveSequelize, sequelize) {
  let incursionMap;

  const IncursionMap = sequelize.define('IncursionMap', {
    constellationID: Sequelize.INTEGER,
    value:           Sequelize.JSON
  });

  return getConstellations(eveSequelize)
    .then(constellations => incursionMap = constellations)
    .then(() => getStations(eveSequelize))
    .then(stations => mapSystemsToConstellations(incursionMap, stations, eveSequelize))
    .then(() => IncursionMap.sync({force: true}))
    .then(() => {
      logger.action('IncursionMap model synced', [], 'green');
      return Promise.all(incursionMap.map(constellation =>
        IncursionMap.create({
          constellationID: constellation.constellationID,
          value:           constellation
        })
      ));
    })
    .then(() => {
      logger.action(`IncursionMap model saved, ${incursionMap.length} rows added`, [], 'green');
      return incursionMap.length;
    });
}
