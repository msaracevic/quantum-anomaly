import eveGetUniveseItems from '../tasks/eve/get-universe-items';
import {updateNullData} from '../tasks/eve/get-universe-items';
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

export function updateMarketNull(req, res) {
  updateNullData('market').then(() => res.json('Triggered nulled market updates, check server logs for progress'));
}

export function updateInventoryNull(req, res) {
  updateNullData('invTypes').then(() => res.json('Triggered nulled inventory updates, check server logs for progress'));
}
