import remoteRequest from 'request';

import * as logger from './logger';

function request(options, callback, args) {
  options.headers = {'User-Agent': process.env.USER_AGENT};
  if (!args) args = {options: options};
  remoteRequest(options, (error, response, body) => {
    if (!error) {
      logger.action(`Request for ${options.url} got response`, 'gray');
      callback(null, response, args);
    } else {
      logger.error(`Failed to retrieve ${options.url}`);
      logger.inspect(error);
      logger.error(`-----------------------`);
      callback(error, response, args);
    }
  });
}

function repeat(callback, minutes) {
  let updateInterval = 3 * 60 * 1000;
  if (minutes) updateInterval = minutes * 60 * 1000;
  return setInterval(callback, updateInterval);
}

function dynamicSort(property, caseInsensitive) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property  = property.substr(1);
  }
  return (a, b) => {
    let result;
    if (caseInsensitive) {
      result = (a[property].toLocaleLowerCase() < b[property].toLocaleLowerCase()) ? -1 : (a[property].toLocaleLowerCase() > b[property].toLocaleLowerCase()) ? 1 : 0;
    } else {
      result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    }
    return result * sortOrder;
  };
}

function dynamicSortMultiple() {
  const props = arguments;
  return (obj1, obj2) => {
    let index,
        result = 0;
    for (index = 0; result === 0 && index < props.length; index++) {
      result = dynamicSort(props[index])(obj1, obj2);
    }
    return result;
  };
}

function clone(obj) {
  if (obj === null || typeof(obj) !== 'object') return obj;
  let temp = new obj.constructor();
  for (let key in obj) if (obj.hasOwnProperty(key)) temp[key] = clone(obj[key]);
  return temp;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  request,
  repeat,
  capitalize,
  dynamicSort,
  dynamicSortMultiple,
  clone
};
