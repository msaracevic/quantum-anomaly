import axios from 'axios';
import * as logger from '../../helpers/logger';
import {models} from '../../models';

const URLS = {
  Groups:          'https://esi.tech.ccp.is/latest/universe/groups',
  Types:           'https://esi.tech.ccp.is/latest/universe/types',
  DogmaAttributes: 'https://esi.evetech.net/latest/dogma/attributes',
  DogmaEffects:    'https://esi.evetech.net/latest/dogma/effects',
  appendix:        '?datasource=tranquility&language=en-us'
};

const HEADER = process.env.USER_AGENT_CACHE;

function getAllIds(url, currentPage = 1, itemIds) {
  return axios.get(`${url}&page=${currentPage}`, HEADER).then(response => {
    let maxPage = parseInt(response.headers['x-pages'], 10);
    itemIds     = itemIds.concat(response.data);

    if (currentPage <= maxPage) return getAllIds(url, currentPage + 1, itemIds);
    else return itemIds.map(type => {
      return {
        id:        type,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
  }).catch(function (error) {
    logger.error(`URL: ${url}&page=${currentPage}, ${error}`);
  });
}

function requestData(url, id, model) {
  axios.get(url, HEADER).then(response => {
    if (response.data) model.update({
      data: response.data
    }, {where: {id: id}});
    else model.destroy({
      where: {id: id}
    });
  }).catch(function (error) {
    logger.error(`URL: ${url}, ${error}`);
  });
}

export function updateNullData(table) {
  let model = models[`Eve${table}`];
  return model.findAll({where: {data: null}})
    .then(items => {
      if (!items.length) logger.appLog(`Eve${table} has no null entries`, 'yellow');
      return updateData(items, table, model);
    });
}

function updateData(items, table, model) {
  return items.map((item, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        requestData(`${URLS[table]}/${item.id}/${URLS.appendix}`, item.id, model);
        if (index === Math.ceil(items.length * 0.25)) logger.action(`Update data of Eve${table} table at 25%`);
        if (index === Math.ceil(items.length * 0.50)) logger.action(`Update data of Eve${table} table at 50%`);
        if (index === Math.ceil(items.length * 0.75)) logger.action(`Update data of Eve${table} table at 75%`);
        if (index === items.length - 1) logger.action(`Update data of Eve${table} table at 100%`, 'yellow');
        resolve();
      }, index * 30);
    });
  });
}

export function getData(table) {
  // each table we want to fill needs to ask one endpoints for list of all ID's
  // and then we iterate over that list and ask for data for each separate ID
  let itemIds,
      model = models[`Eve${table}`];

  logger.action(`Starting to request all Eve${table} ID's`);

  return getAllIds(`${URLS[table]}/${URLS.appendix}`, 1, [])
    .then(response => {
      logger.action(`Done requesting all Eve${table} ID's`);
      itemIds = response;
    }).then(() => {
      logger.action(`Removing all data from Eve${table} table`);
      return model.destroy({truncate: true});
    }).then(() => {
      logger.action(`Adding ${itemIds.length} ID's to Eve${table} table`);
      return model.bulkCreate(itemIds);
    }).then(() => {
      logger.action(`Requesting data for every ID from Eve${table} table`);
      return Promise.all(updateData(itemIds, table, model));
    });
}

export function updateAll(types, index = 0) {
  return updateNullData(types[index])
    .then(() => {
      if (types.length > index + 1) return updateAll(types, index + 1);
      else logger.action('Done updating all entries', 'red');
    });
}

export function createAll(types, index = 0) {
  return getData(types[index])
    .then(() => {
      if (types.length > index + 1) return createAll(types, index + 1);
      else logger.action('Done creating all entries', 'red');
    });
}
