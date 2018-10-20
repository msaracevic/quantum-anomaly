import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

import * as logger from '../../helpers/logger';
import shipProperties from './helpers/ship-properties';

const TYPE_SELECT   = {type: Sequelize.QueryTypes.SELECT};
const modelFilePath = path.join(__dirname, '..', '..', 'models', 'dynamic-models', 'ships-dynamic-model.js');

function addTraits(ships, sequelize) {
  // These are ship flat bonuses, like 4% bonus to shield resistance, etc...
  const query = 'SELECT * FROM "invTraits"';

  return Promise.all(ships.map(ship =>
    sequelize.query(`${query} WHERE "typeID"=${ship.typeID}`, TYPE_SELECT)
      .then(traits => {
        traits.forEach(trait => {
          if (trait.bonusText) trait.bonusText = trait.bonusText.replace(/<a.*?>/g, '').replace(/<\/a>/g, '');
          if (!ship.traits) ship.traits = {};
          if (trait.skillID === -1) {
            if (!ship.traits['Ship']) ship.traits['Ship'] = [];
            ship.traits['Ship'].push(trait);
          } else {
            if (!ship.traits[trait.skillID]) ship.traits[trait.skillID] = [];
            ship.traits[trait.skillID].push(trait);
          }
        });
      })
  )).then(() => logger.action('Added traits to each ship'));
}

function addProperties(ships, sequelize) {
  // These are ship specific values, like shield amnout, gun ports, etc...
  const query = 'SELECT * FROM "dgmTypeAttributes" ' +
    'INNER JOIN "dgmAttributeTypes" ' +
    'ON "dgmTypeAttributes"."attributeID" = "dgmAttributeTypes"."attributeID"';

  return Promise.all(ships.map(ship =>
    sequelize.query(`${query} WHERE "typeID"=${ship.typeID}`, TYPE_SELECT)
      .then(attributes => {
        attributes.forEach(attribute => {
          if (attribute.published) {
            ship[attribute.attributeName] = attribute.valueFloat;
            if (!ship[attribute.attributeName]) {
              ship[attribute.attributeName] = attribute.valueInt;
            }
          }
        });
      })
  )).then(() => logger.action('Added properties to each ship'));
}

function getModel(ships) {
  logger.action('Generating ships model', [], 'green');
  let error = false;

  const modelForRecreating = {},
        model              = {};

  ships.forEach(ship => {
    Object.keys(ship).forEach(attribute => {
      if (!model[attribute]) {
        if (typeof ship[attribute] === 'number') {
          model[attribute]              = Sequelize.FLOAT;
          modelForRecreating[attribute] = 'FLOAT';
        } else if (typeof ship[attribute] === 'string') {
          model[attribute]              = Sequelize.STRING;
          modelForRecreating[attribute] = 'STRING';
        } else if (typeof ship[attribute] === 'boolean') {
          model[attribute]              = Sequelize.BOOLEAN;
          modelForRecreating[attribute] = 'BOOLEAN';
        } else if (typeof ship[attribute] === 'object') {
          model[attribute]              = Sequelize.JSON;
          modelForRecreating[attribute] = 'JSON';
        } else {
          error = true;
          logger.action(`Unhandled attribute type ${attribute} ('${typeof ship[attribute]})`, ['error']);
        }
      }
    });
  });

  if (error) {
    logger.action('Aborting process at saving ships', ['error']);
    process.exit(1);
  } else {
    // save the model in file so that we can reuse it in main app
    const data = `export default function () { return ${JSON.stringify(modelForRecreating)}}`;
    fs.closeSync(fs.openSync(modelFilePath, 'w'));
    fs.writeFileSync(modelFilePath, data, 'utf-8');
    logger.action('Dynamic ships model saved into file', [], 'blue');
  }

  return model;
}

function getShips(sequelize) {
  const query = 'SELECT * FROM "invTypes" ' +
    'JOIN "invGroups" ON "invTypes"."groupID" = "invGroups"."groupID" ' +
    'JOIN "invCategories" ON "invGroups"."categoryID" = "invCategories"."categoryID" ' +
    'LEFT JOIN "chrRaces" ON "invTypes"."raceID" = "chrRaces"."raceID" ' +
    'WHERE "invCategories"."categoryID"=6 AND "invTypes"."published"=true';

  return sequelize.query(query, TYPE_SELECT).then(shipsData => {
    logger.action('Grabbed data for ' + shipsData.length + ' ships');
    return shipsData;
  });
}

export default function (eveSequelize, sequelize) {
  let Ships,
      ships;

  return getShips(eveSequelize)
    .then(shipsData => ships = shipsData)
    .then(() => addTraits(ships, eveSequelize))
    .then(() => addProperties(ships, eveSequelize))
    .then(() => {
      // Clean up extra properties we don't need
      shipProperties(ships);

      // Define ships table in our database and save all info
      Ships = sequelize.define('Ships', getModel(ships));
      return Ships.sync({force: true});
    })
    .then(() => {
      logger.action('Ships model synced', [], 'green');
      return Promise.all(ships.map(ship => Ships.create(ship)));
    })
    .then(() => {
      logger.action(`Ships model saved, ${ships.length} rows added`, [], 'green');
      return ships.length;
    });
}
