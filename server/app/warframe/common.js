import * as helpers from '../../helpers';
import translations from './resources/translations';

export function faction(arg) {
  return helpers.capitalize(arg.replace('FC_', '').toLowerCase());
}

export function planetName(arg) {
  let planetRegexp = /\((.*?)\)/g;
  return planetRegexp.exec(arg.value)[1];
}

export function rewards(data) {
  const rewards = [];
  if (data.credits) {
    rewards.push(data.credits.toLocaleString('de-DE', {
      style:                 'decimal',
      minimumFractionDigits: 0
    }) + ' credits');
  }
  if (data.items)
    data.items.forEach(item =>
      rewards.push(translations(item)));
  if (data['countedItems'])
    data['countedItems'].forEach(item =>
      rewards.push(`${item['ItemCount']} x ${translations(item['ItemType'])}`));

  return rewards;
}

