import * as eveApiAdapter from '../tasks/eve/eve-api-adapter';
import eveGenerateShips from '../tasks/eve/generate-ships';
import {appWarning} from '../helpers/logger';

const ALLOWED = ['groups', 'types', 'dogmaAttributes', 'dogmaEffects'];

export function getData(req, res) {
  const type = req.params.type;
  if (ALLOWED.indexOf(type) !== -1) {
    eveApiAdapter.getData(type.charAt(0).toUpperCase() + type.slice(1));
    res.json(`Started full update of ${type} table, there is no progress update until it is finished, check server logs for success message on the end`);
  } else {
    res.json(`${type} table does not exist, hence it can't be updated`);
  }
}

export function updateData(req, res) {
  const type = req.params.type;
  if (ALLOWED.indexOf(type) !== -1) {
    eveApiAdapter.updateNullData(type.charAt(0).toUpperCase() + type.slice(1));
    res.json(`Started update of all nulled values in ${type} table, there is no progress update until it is finished, check server logs for success message on the end`);
  } else {
    res.json(`${type} table does not exist, hence it can't be updated`);
  }
}

export function generateShips(req, res) {
  eveGenerateShips().then(() =>
    res.json('Triggered ship table generation, check server logs for progress')
  );
}

export function updateAll(req, res) {
  eveApiAdapter.updateAll(ALLOWED.map(type => type.charAt(0).toUpperCase() + type.slice(1)));
  res.json(`Started full update of all EVE tables, there is no progress update until it is finished, check server logs for success message on the end`);
}

export function createAll(req, res) {
  eveApiAdapter.createAll(ALLOWED.map(type => type.charAt(0).toUpperCase() + type.slice(1)));
  res.json(`Started to create all EVE tables, there is no progress update until it is finished, check server logs for success message on the end`);
}

export function generateAll(req, res) {
  eveGenerateShips().then(() =>
    res.json('Triggered ship table generation, check server logs for progress')
  );
}
