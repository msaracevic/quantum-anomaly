import * as logger from '../../helpers/logger';
import {models} from '../../models';

export default function () {
  let shipTypesBulk = [],
      shipIds       = [],
      shipsBulk     = [];

  return models.EveMarketGroups.findAll().then(marketGroups => {
    shipTypesBulk = marketGroups
      .filter(marketGroup => marketGroup.dataValues.data.category_id === 6 && marketGroup.dataValues.data.published)
      .map(marketGroup => {
        shipIds = shipIds.concat(marketGroup.dataValues.data.types);
        return {
          id:        marketGroup.dataValues.data.group_id,
          name:      marketGroup.dataValues.data.name,
          data:      marketGroup.dataValues.data.types,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        // { id: 6,
        //   name: 'Strategic Cruiser',
        //   data: [ 29984, 29986, 29988, 29990 ] }
      });
  }).then(() => {
    return Promise.all(shipIds.map(id =>
      models.EveInvTypes.find({
        where: {id: id}
      }).then(ship => {
        if (ship) {
          return ship.dataValues.data;
        } else {
          return null;
        }
      })
    ));
  }).then(ships => {
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

    // remove unpublished ships from shipTypesBulk
    shipTypesBulk.forEach(shipType => {
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
    return models.EveShipTypes.bulkCreate(shipTypesBulk).then(() =>
      logger.action(`Created ${shipTypesBulk.length} ship types`)
    );
  }).then(() => {
    return models.EveShips.destroy({truncate: true});
  }).then(() => {
    return models.EveShips.bulkCreate(shipsBulk).then(() =>
      logger.action(`Created ${shipsBulk.length} ships`)
    );
  });
}
