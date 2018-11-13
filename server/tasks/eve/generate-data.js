import * as logger from '../../helpers/logger';
import {models} from '../../models';
import {dynamicSortMultiple} from '../../helpers';

const TABLE_GROUPS = {
  6: 'EveShipGroups',
  7: 'EveModuleGroups'
};

const TABLE_ITEMS = {
  6: 'EveShips',
  7: 'EveModules'
};

const NAME = {
  6: 'ship',
  7: 'module'
};

async function getGroups(type) {
  /* getGroups returns array of objects like
    {
      id:        330,
      name:      'Cloaking Device',
      data:      [ 11370, 11577, ...],
      createdAt: 2018-11-12T23:56:23.408Z,
      updatedAt: 2018-11-12T23:56:23.408Z
    }
  */
  return models.EveGroups.findAll().then(groups =>
    groups.filter(group => group.data.category_id === type && group.data.published)
      .map(group => {
        return {
          id:        group.data.group_id,
          name:      group.data.name,
          data:      group.data.types,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
  );
}

async function getItems(group) {
  /* getItems returns each item in group in form of
    {
      'id':        11370,
      'data':      { 'capacity': 0, 'dogma_attributes': [{'attribute_id': 161, 'value': 100}, ...},
      'createdAt': '2018-11-12T17:26:25.722Z',
      'updatedAt': '2018-11-12T17:28:43.218Z'
    };
   */
  return Promise.all(group.data.map((itemId, index) => {
    return models.EveTypes.findOne({where: {id: itemId}});
  })).then(items => items.filter(item => item.data.published === true));
}

function addDetails(item) {
  /* Augments group with names from each item, so we use it as display name, groups will look like
    {
      'id':        330,
      'name':      'Cloaking Device',
      'data':      [{'id': 11370, 'name': 'Prototype Cloaking Device I', 'metaLevel: 0}, ...],
      'createdAt': '2018-11-12T23:57:54.580Z',
      'updatedAt': '2018-11-12T23:57:54.580Z'
    }
  */
  const metaLevel = item.data.dogma_attributes.filter(attr => attr.attribute_id === 633);

  let data = {
    id:   item.id,
    name: item.data.name
  };

  if (metaLevel[0]) data.meta_level = metaLevel[0].value;
  else data.meta_level = 0;
  return data;
}

export default async function (type = 7) {
  let items  = [],
      groups = await getGroups(type);

  logger.action(`Started generating ${NAME[type]} data`);

  await Promise.all(
    groups.map(async group => {
      let itemsInGroup = await getItems(group);

      // attach names and meta level to items inside group
      group.data = itemsInGroup.map(item => addDetails(item));
      group.data.sort(dynamicSortMultiple('meta_level', 'name'));

      // add these items into another array so we can dump them in database as bulk
      itemsInGroup = itemsInGroup.map(item => {
        item.data.group_name = group.name;
        return {
          id:        item.data.type_id,
          name:      item.data.name,
          data:      item.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      items = items.concat(itemsInGroup);
    })
  );

  // remove groups which have no items
  groups = groups.filter(group => group.data.length !== 0);

  await models[TABLE_GROUPS[type]].destroy({truncate: true});
  logger.action(`Deleted ${NAME[type]} group table`);

  await models[TABLE_ITEMS[type]].destroy({truncate: true});
  logger.action(`Deleted ${NAME[type]} items table`);

  await models[TABLE_GROUPS[type]].bulkCreate(groups);
  logger.action(`Added ${groups.length} rows in ${NAME[type]} group table`);

  await models[TABLE_ITEMS[type]].bulkCreate(items);
  logger.action(`Added ${items.length} rows in ${NAME[type]} items table`);
}
