import axios from 'axios';
import * as logger from '../../helpers/logger'
import {models} from '../../models';

const URLS = {
  groups:     'https://esi.tech.ccp.is/latest/universe/groups/?datasource=tranquility',
  groupsInfo: 'https://esi.tech.ccp.is/latest/universe/groups/',
  types:      'https://esi.tech.ccp.is/latest/universe/types/?datasource=tranquility',
  typesInfo:  'https://esi.tech.ccp.is/latest/universe/types/',
  appendix:   '/?datasource=tranquility&language=en-us'
};

const HEADER = process.env.USER_AGENT_CACHE;

function getListOfIds(url, currentPage, arrayOfIds) {
  return axios.get(`${url}&page=${currentPage}`, HEADER).then(response => {
    let maxPage = parseInt(response.headers['x-pages'], 10);
    arrayOfIds  = arrayOfIds.concat(response.data);

    if (currentPage <= maxPage) return getListOfIds(url, currentPage + 1, arrayOfIds);
    else return arrayOfIds.map(type => {
      return {
        id:        type,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }).catch(function (error) {
    logger.error(`URL: ${url}&page=${currentPage}, ${error}`);
  });
}

function getData(url, id, model) {
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

export default function (table) {
  // each endpoint option consist of one enpoint which returns just id's
  // and then we iterate over that and ask for data for each it
  let startingPage = 1,
      arrayOfIds,
      model,
      label,
      IDsUrl,
      dataUrl;

  if (table === 'market') {
    model  = models.EveMarketGroups;
    label  = 'EveMarketGroups';
    IDsUrl = URLS.groups;
  }
  if (table === 'invTypes') {
    model  = models.EveInvTypes;
    label  = 'EveInvTypes';
    IDsUrl = URLS.types;
  }

  logger.action(`Starting to request all ${label} ID's`);

  return getListOfIds(IDsUrl, startingPage, []).then(response => {
    logger.action(`Done requesting all ${label} ID's`);
    arrayOfIds = response;
  }).then(() => {
    return model.destroy({truncate: true});
  }).then(() => {
    logger.action(`Removed all items from ${label}`)
  }).then(() => {
    return model.bulkCreate(arrayOfIds);
  }).then(() => {
    logger.action(`Added ${arrayOfIds.length} items to ${label}`);
  }).then(() => {
    logger.action(`Requesting data of ${label}`);
    arrayOfIds.map((item, index) => {
      setTimeout(() => {
        if (table === 'market') dataUrl = `${URLS.groupsInfo}${item.id}${URLS.appendix}`;
        if (table === 'invTypes') dataUrl = `${URLS.typesInfo}${item.id}${URLS.appendix}`;
        getData(dataUrl, item.id, model);
        if (index === arrayOfIds.length - 1) logger.action(`Requested last data of ${label}`);
      }, index * 50);
    });
  });
}
