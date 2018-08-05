import axios from 'axios';
import * as logger from '../../helpers/logger'

const URL_IDS           = 'https://esi.tech.ccp.is/latest/universe/types/?datasource=tranquility',
      URL_INFO          = 'https://esi.tech.ccp.is/latest/universe/types/',
      URL_INFO_APPENDIX = '/?datasource=tranquility&language=en-us';

function getInvTypeIds(currentPage, invTypesIds) {
  return axios.get(`${URL_IDS}&page=${currentPage}`, {headers: {'User-Agent': 'Quantum Anomaly Cache Weekly Job - DEV enviroment, saracevic.miroslav@gmail.com'}})
    .then(function (response) {
      let maxPage = parseInt(response.headers['x-pages'], 10);
      invTypesIds = invTypesIds.concat(response.data);

      if (currentPage <= maxPage) {
        return getInvTypeIds(currentPage + 1, invTypesIds);
      }
      else {
        return invTypesIds.map(type => {
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

function getInvType(id, models) {
  let url = `${URL_INFO}${id}${URL_INFO_APPENDIX}`;
  axios.get(url, {headers: {'User-Agent': 'Quantum Anomaly Cache Weekly Job - DEV enviroment, saracevic.miroslav@gmail.com'}})
    .then(function (response) {
      if (response.data.published) {
        models.EveInvTypes.update({
            data: response.data
          }, {
            where: {
              id: id
            }
          }
        )
      } else {
        models.EveInvTypes.destroy({
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
      invTypesIds;

  logger.action('Starting to request all EveInvTypes ID\'s');
  getInvTypeIds(startingPage, []).then(response => {
    logger.action('Done requesting all EveInvTypes ID\'s');
    invTypesIds = response;
    models.EveInvTypes.destroy({
      truncate: true
    }).then(() => {
      logger.action(`Removed all items from EveInvTypes`);
      return models.EveInvTypes.bulkCreate(invTypesIds);
    }).then(() => {
      logger.action(`Added ${invTypesIds.length} items to EveInvTypes`);
    }).then(() => {
      let timer = 0;
      invTypesIds.map(type => {
        timer++;
        setTimeout(() => {
          getInvType(type.id, models);
        }, timer * 50);
      });
    });
  });
}
