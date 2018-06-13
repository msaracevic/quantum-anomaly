import * as time from '../../helpers/time';

import nodes from './resources/nodes';
import modifiers from './resources/modifiers';

export default function (arg) {
  const now = new Date();
  const sortieMissions = arg['Variants'];
  
  let sortie = {
    end:      arg['Expiry']['$date']['$numberLong'],
    timeEnd:  time.timeFrom(arg['Expiry']['$date']['$numberLong']),
    missions: [],
    enemy:    nodes(arg['Boss']).faction,
    boss:     nodes(arg['Boss']).name,
    expired:  arg['Expiry']['$date']['$numberLong'] - now.getTime() < 0
  };

  sortieMissions.forEach((mission, index) => {
    let level;
    if (index === 0) level = '40 - 60';
    else if (index === 1) level = '60 - 80';
    else level = '80 - 100';
    sortie.missions.push({
      type:   nodes(mission['missionType']).value,
      node:   nodes(mission['node']),
      effect: modifiers(mission['modifierType']),
      level:  level
    });
  });
  return sortie;
}
