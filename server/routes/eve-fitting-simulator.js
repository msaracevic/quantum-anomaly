import {models} from '../models';
import {dynamicSort} from "../helpers";

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
      }).then(ship => ship.data))
  )).then(data => {
    data.sort(dynamicSort('name'));
    res.json(data);
  });
}
