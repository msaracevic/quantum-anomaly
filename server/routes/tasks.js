import eveGetUniveseItems from '../tasks/eve/get-universe-items';
import eveGenerateShips from '../tasks/eve/generate-ships';

export function generateShips(req, res) {
  eveGenerateShips().then(() => res.json('Done'));
}

export function updateMarket(req, res) {
  eveGetUniveseItems('market').then(() => res.json('Triggered market update, check server logs for progress'));
}

export function updateInventory(req, res) {
  eveGetUniveseItems('invTypes').then(() => res.json('Triggered inventory update, check server logs for progress'));
}
