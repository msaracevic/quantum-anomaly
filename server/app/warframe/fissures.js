import * as time from '../../helpers/time';
import * as helpers from '../../helpers';

import nodes from './resources/nodes';

function getFissureLevel(arg) {
  if (arg === 'VoidT1') return 'Lith';
  if (arg === 'VoidT2') return 'Meso';
  if (arg === 'VoidT3') return 'Neo';
  if (arg === 'VoidT4') return 'Axi';
}

export default function (arg) {
  let fissures = {
    lith: [],
    meso: [],
    neo:  [],
    axi:  []
  };
  
  arg.forEach(fissure => {
    const fissureLevel = getFissureLevel(fissure['Modifier']).toLowerCase();
    
    fissures[fissureLevel].push({
      start:        fissure['Activation']['$date']['$numberLong'],
      timeStart:    time.timeFrom(fissure['Activation']['$date']['$numberLong']),
      end:          fissure['Expiry']['$date']['$numberLong'],
      timeEnd:      time.timeFrom(fissure['Expiry']['$date']['$numberLong']),
      node:         nodes(fissure['Node']),
      type:         nodes(fissure['MissionType']).value,
      sortModifier: fissure['Modifier'].replace('VoidT', ''),
      region:       fissure['Region']
    });
  });
  
  Object.keys(fissures)
    .forEach(key => fissures[key].sort(helpers.dynamicSort('region')));
  
  return fissures;
}
