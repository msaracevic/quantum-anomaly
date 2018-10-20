import {models} from '../models';
import {dynamicSortMultiple} from '../helpers';
import units from '../app/eve-fitting-simulator/units';

import * as logger from '../helpers/logger';

export function getShipGroups(req, res) {
  models.EveShipGroups.findAll({
    order: ['name']
  }).then(data => res.json(data.map(data => {
    return {id: data.id, name: data.name};
  })));
}

export function getShipGroup(req, res) {
  let groupInfo = null;

  models.EveShipGroups.findOne({
    where: {id: req.body.id}
  }).then(group => {
    groupInfo = group;
    return Promise.all(group.data.map(ship =>
      models.EveShips.findOne({
        where: {id: ship.id}
      }).then(ship => {
        return {
          name:       ship.data.name,
          type_id:    ship.data.type_id,
          meta_level: ship.data.dogma_attributes
                        .filter(attribute => attribute.attribute_id === 633)[0].value
        };
      }))
    );
  }).then(ships => {
    ships.sort(dynamicSortMultiple('meta_level', 'name'));
    res.json({
      name:  groupInfo.name,
      id:    groupInfo.id,
      ships: ships
    });
  });
}

export function getShip(req, res) {
  let shipData  = null,
      groupInfo = null;

  models.EveShips.findOne({
    where: {id: req.body.id}
  }).then(ship => {
    shipData = ship.data;

    shipData.dogmaAttributesNamed = {};
    // for each dogma attribute we need name and unit if it has it
    // keep the originals intact and create new object where we can reference
    // it by name
    return models.EveDogmaAttributes.findAll().then(dogmaAttributes => {
      let dogmaAttributesById = {};
      // from the database response, these are all defined attributes in game
      // build in form of
      // {actualId: actualData, ...}
      dogmaAttributes.forEach(dogmaAttribute => {
        dogmaAttributesById[dogmaAttribute.id] = dogmaAttribute.data;
      });

      // missing from API export... ccc...
      dogmaAttributesById[1547].unit += ';4=capital';

      // from the already known attributes on the ship, go for each and
      // attach additional data from previous step
      shipData.dogma_attributes.forEach(shipDogmaAttribute => {
        let dogmaAttribute = dogmaAttributesById[shipDogmaAttribute.attribute_id],
            dogmaValue     = shipDogmaAttribute.value,
            namedIndex     = dogmaAttribute.display_name,
            dogmaIndexRef  = dogmaAttribute.attribute_id;

        if (!namedIndex || namedIndex === '') namedIndex = dogmaAttribute.name;

        shipData.dogmaAttributesNamed[namedIndex] = {
          value: dogmaValue,
          index: dogmaIndexRef
        };

        let unit = units(dogmaAttribute.unit_id);
        // yea, well, good luck figuring this out in a month...
        if (unit) {
          // if unit is in form of "1=small;2=medium;3=large"
          unit.split(';').forEach(part => {
            if (part.indexOf(dogmaValue) !== -1) unit = part.split('=')[1];
          });
          shipData.dogmaAttributesNamed[namedIndex].units = unit;
        }
      });
    });
  }).then(() => {
    res.json(shipData);
  });
}
