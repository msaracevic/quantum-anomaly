import * as logger from '../../helpers/logger';
import {models} from '../../models';
import {dynamicSortMultiple} from "../../helpers";

async function getItemDetails(group) {
  return models.EveModules
    .findAll({where: {market_group_id: group.data.market_group_id}})
    .then(items => items.map(item => {
      return {id: item.id, name: item.name, meta_level: item.data.meta_level};
    }))
    .then(items => items.sort(dynamicSortMultiple('meta_level', 'name')));
}

async function getSubgroups(marketData, currentId) {
  let data = [];
  await Promise.all(marketData.map(async group => {
    if (group.data.parent_group_id === currentId) {
      let currentData = {
        name:      group.data.name,
        id:        group.data.market_group_id,
        subgroups: await getSubgroups(marketData, group.data.market_group_id)
      };
      if (currentData.subgroups.length === 0) {
        delete currentData.subgroups;
        currentData.items = await getItemDetails(group);
      }
      data.push(currentData);
    }
  }));
  return data;
}

export default async function () {
  // this is basically very expensive backward search
  // let's do it for modules first, then see what how it goes (id:9)

  const marketData = await models.EsiMarketGroups.findAll();
  logger.action(`Finding all market groups`);

  const tree = await getSubgroups(marketData, 9);
  logger.action(`Finished generating market cache`);

  return models.EveCache.findOne({
    where: {name: 'modules'}
  }).then(modules => {
    if (modules) {
      modules.data = tree;
      logger.action(`Updating existing module cache`);
      return modules.update(modules);
    }
    else return models.EveCache.create({name: 'modules', data: tree});
  });
}
