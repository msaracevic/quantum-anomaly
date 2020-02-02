import * as logger from '../../helpers/logger';
import {models} from '../../models';
import {dynamicSortMultiple} from "../../helpers";

async function getSubgroups(marketData, currentId) {
  let data = [];
  await Promise.all(marketData.map(async group => {
    if (group.data.parent_group_id === currentId) {
      let currentData = {
        name:      group.data.name,
        id:        group.data.market_group_id,
        subgroups: await getSubgroups(marketData, group.data.market_group_id)
      };
      if (currentData.subgroups.length === 0) delete currentData.subgroups;
      data.push(currentData);
    }
  }));
  data.sort(dynamicSortMultiple('id'));
  return data;
}

export default async function () {
  // this is basically very expensive backward search
  // let's do it for modules first, then see what how it goes (id:9)

  const marketData = await models.EsiMarketGroups.findAll();
  logger.action(`Finding all market groups`);

  const tree = await getSubgroups(marketData, 9);
  logger.action(`Finished generating market cache`);

  await models.EveCache.destroy({where: {name: 'modules'}});
  logger.action(`Deleting existing cache`);

  await models.EveCache.create({name: 'modules', data: tree});
  logger.action(`Creating new cache`);
}
