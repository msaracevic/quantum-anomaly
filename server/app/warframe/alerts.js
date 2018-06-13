import * as time from '../../helpers/time';

import * as common from './common'
import nodes from './resources/nodes';

function nodeName(arg) {
  let planet = ` (${common.planetName(arg)})`;
  return arg.value.replace(planet, '');
}

export default function (arg) {
  let alerts = [];
  arg.forEach(alert => {
    alerts.push({
      start:     alert['Activation']['$date']['$numberLong'],
      timeStart: time.timeFrom(alert['Activation']['$date']['$numberLong']),
      end:       alert['Expiry']['$date']['$numberLong'],
      timeEnd:   time.timeFrom(alert['Expiry']['$date']['$numberLong']),
      faction:   common.faction(alert['MissionInfo']['faction']),
      level:     `${alert['MissionInfo']['minEnemyLevel']} - ${alert['MissionInfo']['maxEnemyLevel']}`,
      location:  nodes(alert['MissionInfo']['location']).value,
      type:      nodes(alert['MissionInfo']['missionType']).value,
      rewards:   common.rewards(alert['MissionInfo']['missionReward'])
    });
  });
  return alerts;
}
