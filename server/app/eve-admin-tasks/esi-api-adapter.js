import axios from 'axios';
import * as logger from '../../helpers/logger';
import {models} from '../../models';
import {wait} from '../../helpers';

const THROTTLE_MS = 10;

const URLS = {
  MarketGroups:       'https://esi.evetech.net/latest/markets/groups',
  UniverseGroups:     'https://esi.evetech.net/latest/universe/groups',
  UniverseCategories: 'https://esi.evetech.net/latest/universe/categories',
  UniverseTypes:      'https://esi.evetech.net/latest/universe/types',
  DogmaAttributes:    'https://esi.evetech.net/latest/dogma/attributes',
  DogmaEffects:       'https://esi.evetech.net/latest/dogma/effects',
  appendix:           '?datasource=tranquility&language=en-us'
};

const HEADER = process.env.USER_AGENT_CACHE;

function requestIds(url, currentPage = 1, ids) {
  return axios.get(`${url}&page=${currentPage}`, HEADER).then(response => {
    ids = ids.concat(response.data);

    if (currentPage <= parseInt(response.headers['x-pages'], 10)) return requestIds(url, currentPage + 1, ids);
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
  await wait(index * THROTTLE_MS);

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

async function fetchEndpoint(table) {
  const model = models[`Esi${table}`];

  if (!model) {
    logger.error(`Unknown data model ${table}`);
    return;
  }

  logger.action(`Getting all ID's  of ${table}`);
  const listOfIds = await requestIds(`${URLS[table]}/${URLS.appendix}`, 1, []);

  // example of firing all the async/awaits in parallel, but slowing execution for and index * seconds
  logger.action(`Getting all items of ${table}`);
  const items = await Promise.all(listOfIds.map(async (id, index) => getItem(id, index, table, listOfIds.length)));

  logger.action(`Deleting all the data from Esi${table} table`);
  await model.destroy({truncate: true});

  logger.action(`Adding ${items.length} rows in Esi${table} table`);
  await model.bulkCreate(items);
}

async function updateItems(table) {
  let model       = models[`Esi${table}`],
      nullEntries = await model.findAll({where: {data: null}});

  if (!nullEntries.length) logger.appLog(`Esi${table} has no missing entries`, 'green');
  else {
    logger.appLog(`Found ${nullEntries.length} missing entries in Esi${table}`, 'red');
    const items = await Promise.all(nullEntries.map(async (entry, index) => getItem(entry.id, index, table, nullEntries.length)));
    items.forEach(item => {
      model.update({
        data: item.data
      }, {where: {id: item.id}});
    });
  }
}

export async function fetchEndpoints(types) {
  // example of firing async/await in sequence
  for (let i = 0; i < types.length; i++)
    await fetchEndpoint(types[i]);

  logger.action('Done creating all entries', 'green');
}

export async function updateEndpoints(types) {
  // example of firing async/await in sequence
  for (let i = 0; i < types.length; i++)
    await updateItems(types[i]);

  logger.action('Done updating all entries', 'green');
}
