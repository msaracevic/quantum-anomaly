import axios from 'axios';
import * as logger from '../../helpers/logger';
import {models} from '../../models';
import * as helpers from '../../helpers';

const URLS = {
  MarketGroups:       'https://esi.tech.ccp.is/latest/markets/groups',
  UniverseGroups:     'https://esi.tech.ccp.is/latest/universe/groups',
  UniverseCategories: 'https://esi.tech.ccp.is/latest/universe/categories',
  UniverseTypes:      'https://esi.tech.ccp.is/latest/universe/types',
  DogmaAttributes:    'https://esi.evetech.net/latest/dogma/attributes',
  DogmaEffects:       'https://esi.evetech.net/latest/dogma/effects',
  appendix:           '?datasource=tranquility&language=en-us'
};

const HEADER = process.env.USER_AGENT_CACHE;

function requestListOfIds(url, currentPage = 1, ids) {
  return axios.get(`${url}&page=${currentPage}`, HEADER).then(response => {
    ids = ids.concat(response.data);

    if (currentPage <= parseInt(response.headers['x-pages'], 10)) return requestListOfIds(url, currentPage + 1, ids);
    else return ids;
  }).catch(function (error) {
    logger.error(`URL: ${url}&page=${currentPage}, ${error}`);
  });
}

function requestData(url) {
  return axios.get(url, HEADER).then(response => {
    if (response.data) return response.data;
    else return null;
  }).catch(function (error) {
    logger.error(`URL: ${url}, ${error.message}`);
    return null;
  });
}

async function getItem(id, index, table, length) {
  await helpers.wait(index * 30);

  let data = await requestData(`${URLS[table]}/${id}/${URLS.appendix}`);

  if (index === Math.ceil(length * 0.25)) logger.action(`Update data of Esi${table} table at 25%`);
  if (index === Math.ceil(length * 0.50)) logger.action(`Update data of Esi${table} table at 50%`);
  if (index === Math.ceil(length * 0.75)) logger.action(`Update data of Esi${table} table at 75%`);
  if (index === length - 1) logger.action(`Update data of Esi${table} table at 100%`, 'yellow');

  return {
    id:        id,
    data:      data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function updateNullData(table) {
  let model       = models[`Esi${table}`],
      nullEntries = await model.findAll({where: {data: null}});

  if (!nullEntries.length) logger.appLog(`Esi${table} has no null entries`, 'green');
  else {
    logger.appLog(`Found ${nullEntries.length} null entries in Esi${table}`, 'red');
    const items = await Promise.all(nullEntries.map(async (entry, index) => getItem(entry.id, index, table, nullEntries.length)));
    items.forEach(item => {
      model.update({
        data: item.data
      }, {where: {id: item.id}});
    });
  }
}

export async function updateAll(types, index = 0) {
  await updateNullData(types[index]);
  if (types.length > index + 1) await updateAll(types, index + 1);
  else logger.action('Done updating all entries', 'green');
}


export async function getData(table) {
  const model = models[`Esi${table}`];
  if (!model) logger.error('Unknown data model');

  logger.action(`Getting the full list of ${table} ID's`);
  const listOfIds = await requestListOfIds(`${URLS[table]}/${URLS.appendix}`, 1, []);

  logger.action(`Getting item details for each ID in ${table} group`);
  const items = await Promise.all(listOfIds.map(async (id, index) => getItem(id, index, table, listOfIds.length)));

  logger.action(`Deleting all the data from Esi${table} table`);
  await model.destroy({truncate: true});

  logger.action(`Adding ${items.length} rows in Esi${table} table`);
  await model.bulkCreate(items);
}

export async function createAll(types, index = 0) {
  await getData(types[index]);
  if (types.length > index + 1) await createAll(types, index + 1);
  else logger.action('Done creating all entries', 'green');
}
