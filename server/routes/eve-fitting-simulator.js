import {models} from '../models';
import {dynamicSortMultiple} from '../helpers';
import units from '../app/eve-fitting-simulator/units';

import * as logger from '../helpers/logger';

export function getShipGroups(req, res) {
  models.EveShipTypes.findAll({
    order: ['name']
  }).then(data => res.json(data.map(data => {
    return {id: data.id, name: data.name};
  })));
}

export function getShipGroup(req, res) {
  models.EveShipTypes.findOne({
    where: {
      id: req.body.id
    }
  }).then(group => Promise.all(
    group.data.map(ship =>
      models.EveShips.findOne({
        where: {id: ship.id}
      }).then(ship => {
        return {
          name: ship.data.name,
          type_id: ship.data.type_id,
          meta_level: ship.data.dogma_attributes.filter(attribute => attribute.attribute_id === 633)[0].value
        }
      }))
  )).then(data => {
    data.sort(dynamicSortMultiple('meta_level', 'name'));
    res.json(data);
  });
}

export function getShip(req, res) {
  let fullShipModel = null;
  models.EveShips.findOne({
    where: {
      id: req.body.id
    }
  }).then(ship => {
    fullShipModel = ship.data;
    // for each dogma attribute we need name and unit if it has it
    // keep the originals intact and create new object where we can reference
    // it by name
    ship.data.dogmaAttributesNamed = {};
    return Promise.all(ship.data.dogma_attributes.map((dogmaAttribute, index) => {
      return models.EveDogmaAttributes.findOne({where: {id: dogmaAttribute.attribute_id}})
        .then(dogmaAttribute => {
          dogmaAttribute = dogmaAttribute.data;

          let dogmaValue   = ship.data.dogma_attributes[index].value,
              namedIndex   = dogmaAttribute.display_name,
              rawAttribute = false;

          if (!namedIndex || namedIndex === '') {
            namedIndex   = dogmaAttribute.name;
            rawAttribute = true;
          }

          ship.data.dogmaAttributesNamed[namedIndex] = {
            value:        dogmaValue,
            rawAttribute: rawAttribute,
          };

          if (dogmaAttribute.unit_id) {
            let unit = units(dogmaAttribute.unit_id);
            // yea, well, good luck figuring this out in a month...
            if (unit) {
              // if unit is in form of "1=small;2=medium;3=large"
              if (unit.indexOf(';') !== -1) {
                (unit.split(';')).forEach(part => {
                  if (part.indexOf(dogmaValue) !== -1) unit = (part.split('='))[1];
                });
              }
              ship.data.dogmaAttributesNamed[namedIndex].units = unit;
            }
          }
        });
    }));
  }).then(() => {
    res.json(fullShipModel);
  });
}
