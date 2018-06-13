import * as time from '../../helpers/time';

import * as common from './common';
import nodes from './resources/nodes';
import translations from './resources/translations';

export default function (arg) {
  let invasions = {};
  arg.forEach(invasion => {
    if (!invasion['Completed']) {
      let translatedGoal  = invasion['Goal'] * 2,
          translatedCount = invasion['Count'] + invasion['Goal'],
          status          = translatedCount / translatedGoal,
          node            = nodes(invasion['Node']),
          planet          = common.planetName(node);

      if (status < 0) status = 0;
      else if (status > 1) status = 1;
      status = 100 - (status * 100);

      if (!invasions[planet]) invasions[planet] = [];
      node.value = node.value.replace(/ \(.*?\)/g, '');

      invasions[planet].push({
        start:           invasion['Activation']['$date']['$numberLong'],
        timeStart:       time.timeFrom(invasion['Activation']['$date']['$numberLong']),
        node:            node.value,
        planet:          planet,
        status:          status.toFixed(2),
        description:     translations(invasion['LocTag']),
        attacker:        common.faction(invasion['AttackerMissionInfo']['faction']),
        defender:        common.faction(invasion['DefenderMissionInfo']['faction']),
        attackerRewards: common.rewards(invasion['AttackerReward']),
        defenderRewards: common.rewards(invasion['DefenderReward'])
      });
    }
  });
  return invasions;
}
