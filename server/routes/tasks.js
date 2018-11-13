import * as eveApiAdapter from '../tasks/eve/eve-api-adapter';
import eveGenerateData from '../tasks/eve/generate-data';

const ALLOWED = ['groups', 'types', 'dogmaAttributes', 'dogmaEffects'];

// only for single group by type name
export function getData(req, res) {
  const type = req.params.type;
  if (ALLOWED.indexOf(type) !== -1) {
    eveApiAdapter.getData(type.charAt(0).toUpperCase() + type.slice(1));
    res.json(`Started full update of ${type} table, there is no progress update until it is finished, check server logs for success message on the end`);
  } else {
    res.json(`${type} table does not exist, hence it can't be updated`);
  }
}

// only for single group by type name
export function updateData(req, res) {
  const type = req.params.type;
  if (ALLOWED.indexOf(type) !== -1) {
    eveApiAdapter.updateNullData(type.charAt(0).toUpperCase() + type.slice(1));
    res.json(`Started update of all nulled values in ${type} table, there is no progress update until it is finished, check server logs for success message on the end`);
  } else {
    res.json(`${type} table does not exist, hence it can't be updated`);
  }
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
  // notable: 6 - ships, 7 - modules , 8 - charges, 16 - implants, 18 - drones, 32 - T3 subsystems, 87 - fighters
  eveGenerateData(6).then(data => eveGenerateData(7)).then(data => res.json('Triggered all data generation, check server logs for progress'));
}

