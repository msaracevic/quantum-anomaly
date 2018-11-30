import {models} from '../models';
import units from '../app/eve-fitting-simulator/units';

import * as logger from '../helpers/logger';

export function getShipGroups(req, res) {
  models.EveShipGroups.findAll({
    order: ['name']
  }).then(data => data.map(data => {
    return {id: data.id, name: data.name};
  })).then(data => res.json(data));
}

export function getShipGroup(req, res) {
  models.EveShipGroups.findOne({
    where: {id: req.body.id}
  }).then(group => {
    res.json({
      name:  group.name,
      id:    group.id,
      ships: group.data
    });
  });
}

export function getModuleGroups(req, res) {
  models.EveCache.findOne({
    where: {name: 'modules'}
  }).then(modules => res.json(modules.data));
}

export async function getShip(req, res) {
  let ship = (await models.EveShips.findOne({where: {id: req.body.id}})).data;

  ship.dogmaAttributesNamed = {};

  await Promise.all(
    ship.dogma_attributes.map(async shipAttr => {
      let attributeInfo = await models.EsiDogmaAttributes.findOne(({where: {id: shipAttr.attribute_id}})),
          unit          = units(attributeInfo.data.unit_id);

      // missing from API export... ccc...
      if (shipAttr.attribute_id === 1547) attributeInfo.data.unit += ';4=capital';

      // yea, well, good luck figuring this out in a month...
      if (unit) {
        // if unit is in form of "1=small;2=medium;3=large"
        unit.split(';').forEach(part => {
          if (part.indexOf(shipAttr.value) !== -1) unit = part.split('=')[1];
        });
      }

      ship.dogmaAttributesNamed[attributeInfo.data.display_name] = {
        index: shipAttr.attribute_id,
        value: shipAttr.value,
        units: unit
      };
    })
  );

  res.json(ship);
}
