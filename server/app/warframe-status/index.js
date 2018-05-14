import {models} from '../../models';

import alerts from './alerts';
import cetus from './cetus';
import fissures from './fissures';
import invasions from './invasions';
import sortie from './sortie';
import planets from './resources/planets';

export default function () {
  return models.WarframeStatus.get().then((data) => {
    const result     = {};
    result.alerts    = alerts(data['Alerts']);
    result.invasions = invasions(data['Invasions']);
    result.sortie    = sortie(data['Sorties'][0]);
    result.cetus     = cetus(data['SyndicateMissions']);
    result.fissures  = fissures(data['ActiveMissions']);
    result.planets   = planets;
    return result;
  });
};
