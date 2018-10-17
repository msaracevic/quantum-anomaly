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
  let model = models[`Eve${table}`],
      dataUrl;

  return model.findAll({where: {data: null}}).then(data => {
    if (!data.length) logger.appWarning('No null entries');
    data.forEach((item, index) => {
      setTimeout(() => {
        dataUrl = `${URLS[table]}/${item.id}/${URLS.appendix}`;
        requestData(dataUrl, item.id, model);
        logger.action(`Requesting ${dataUrl}`);
      }, index * 50);
    });
  });
}

export function getData(table) {
  // each table we want to fill needs to ask one endpoints for list of all ID's
  // and then we iterate over that list and ask for data for each separate ID
  let itemIds,
      model = models[`Eve${table}`],
      label = `eve ${table}`;

  logger.action(`Starting to request all ${label} ID's`);

  return getAllIds(`${URLS[table]}/${URLS.appendix}`, 1, [])
    .then(response => {
      logger.action(`Done requesting all ${label} ID's`);
      itemIds = response;
    }).then(() => {
      logger.action(`Removing all data from ${label} table`);
      return model.destroy({truncate: true});
    }).then(() => {
      logger.action(`Adding ${itemIds.length} ID's to ${label} table`);
      return model.bulkCreate(itemIds);
    }).then(() => {
      let dataUrl;
      logger.action(`Requesting data for every ID from ${label} table`);
      itemIds.map((item, index) => {
        setTimeout(() => {
          dataUrl = `${URLS[table]}/${item.id}/${URLS.appendix}`;
          requestData(dataUrl, item.id, model);
          if (index === Math.ceil(itemIds.length * 0.25))
            logger.appWarning(`Update data of ${label} table at 25%`);
          if (index === Math.ceil(itemIds.length * 0.50))
            logger.appWarning(`Update data of ${label} table at 50%`);
          if (index === Math.ceil(itemIds.length * 0.75))
            logger.appWarning(`Update data of ${label} table at 75%`);
          if (index === itemIds.length - 1)
            logger.action(`Update data of ${label} table at 100% - Done`);
        }, index * 50);
      });
    });
}
