import {models} from '../../models';

import alerts from './alerts';
import cetus from './cetus';
import fissures from './fissures';
import invasions from './invasions';
import sortie from './sortie';
import planets from './resources/planets';

export default function () {
  return models.WarframeStatus.get().then(data => {
    return {
      alerts:    alerts(data['Alerts']),
      invasions: invasions(data['Invasions']),
      sortie:    sortie(data['Sorties'][0]),
      cetus:     cetus(data['SyndicateMissions']),
      fissures:  fissures(data['ActiveMissions']),
      planets:   planets
    };
  });
};
