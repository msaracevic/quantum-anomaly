import axios from 'axios';
import * as logger from '../../helpers/logger'

const URL_IDS           = 'https://esi.tech.ccp.is/latest/universe/groups/?datasource=tranquility',
      URL_INFO          = 'https://esi.tech.ccp.is/latest/universe/groups/',
      URL_INFO_APPENDIX = '/?datasource=tranquility&language=en-us';

function getMarketGroupIds(currentPage, marketGroupIds) {
  return axios.get(`${URL_IDS}&page=${currentPage}`, {headers: {'User-Agent': 'Quantum Anomaly Cache Weekly Job - DEV enviroment, saracevic.miroslav@gmail.com'}})
    .then(function (response) {
      let maxPage = parseInt(response.headers['x-pages'], 10);
      marketGroupIds = marketGroupIds.concat(response.data);

      if (currentPage <= maxPage) {
        return getMarketGroupIds(currentPage + 1, marketGroupIds);
      }
      else {
        return marketGroupIds.map(type => {
          return {
            id:        type,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    })
    .catch(function (error) {
      logger.error(error);
    });
}

function getMarketGroup(id, models) {
  let url = `${URL_INFO}${id}${URL_INFO_APPENDIX}`;
  axios.get(url, {headers: {'User-Agent': 'Quantum Anomaly Cache Weekly Job - DEV enviroment, saracevic.miroslav@gmail.com'}})
    .then(function (response) {
      if (response.data) {
        models.EveMarketGroups.update({
            data: response.data
          }, {
            where: {
              id: id
            }
          }
        )
      } else {
        models.EveMarketGroups.destroy({
          where: {
            id: id
          }
        });
      }
    })
    .catch(function (error) {
      logger.error(error);
    });
}

export default function (models) {
  let startingPage = 1,
      marketGroupIds;

  logger.action('Starting to request all EveMarketGroups ID\'s');
  getMarketGroupIds(startingPage, []).then(response => {
    logger.action('Done requesting all EveMarketGroups ID\'s');
    marketGroupIds = response;
    console.log(response);
    models.EveMarketGroups.destroy({
      truncate: true
    }).then(() => {
      logger.action(`Removed all items from EveMarketGroups`);
      return models.EveMarketGroups.bulkCreate(marketGroupIds);
    }).then(() => {
      logger.action(`Added ${marketGroupIds.length} items to EveMarketGroups`);
    }).then(() => {
      let timer = 0;
      marketGroupIds.map(type => {
        timer++;
        setTimeout(() => {
          getMarketGroup(type.id, models);
        }, timer * 50);
      });
    });
  });
}
