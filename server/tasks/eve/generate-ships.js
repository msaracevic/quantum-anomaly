import * as logger from '../../helpers/logger';
import {models} from '../../models';

export default function () {
  let shipGroupsBulk = [],
      shipIds        = [],
      shipsBulk      = [];

  return models.EveGroups.findAll().then(groups => {
    // first generate ship groups in following form
    // { id: 6,
    //   name: 'Strategic Cruiser',
    //   data: [ 29984, 29986, 29988, 29990 ]
    // }
    // where data is the ID's of the ship which are in this group
    // just take ID=6 which marks ship market groups and are published
    // also remember all the actuall ship ID's we encounter
    shipGroupsBulk = groups
      .filter(group => group.data.category_id === 6 && group.data.published)
      .map(group => {
        shipIds = shipIds.concat(group.data.types);
        return {
          id:        group.data.group_id,
          name:      group.data.name,
          data:      group.data.types,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
  }).then(() => {
    // go through each ship ID's we encountered and get the full model for it
    return Promise.all(shipIds.map(id =>
      models.EveTypes.find({
        where: {id: id}
      }).then(ship => {
        if (ship && ship.data.published) {
          return ship.data;
        } else {
          return null;
        }
      })
    ));
  }).then(ships => {
    // remove if there are any null data for one or the other reason
    shipsBulk = ships
      .filter(ship => ship !== null)
      .map(ship => {
        return {
          id:        ship.type_id,
          name:      ship.name,
          data:      ship,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
    // after all this information is avaiable, go back to the ship groups
    // and attach real ship name to each ID, so we end up with options to later
    // search ships via ID or by name
    shipGroupsBulk.forEach(shipType => {
      shipType.data = shipType.data.map(id => {
        let shipName = null;
        shipsBulk.forEach(ship => {
          if (ship.id === id) shipName = ship.name;
        });
        if (shipName) {
          return {
            id:   id,
            name: shipName
          };
        } else {
          return null;
        }
      }).filter(data => data !== null);
    });
  }).then(() => {
    return models.EveShipTypes.destroy({truncate: true});
  }).then(() => {
    logger.action(`Creating ${shipGroupsBulk.length} groups of ships`);
    return models.EveShipTypes.bulkCreate(shipGroupsBulk);
  }).then(() => {
    return models.EveShips.destroy({truncate: true});
  }).then(() => {
    logger.action(`Creating ${shipsBulk.length} ships`);
    return models.EveShips.bulkCreate(shipsBulk);
  });
}
