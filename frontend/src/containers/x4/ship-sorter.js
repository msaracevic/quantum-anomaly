export function sortShips(ships, sort) {
  if (!sort) return ships;

  const shipCollection = [...ships];
  let isReverse = false;
  if (sort.indexOf('-') === 0) {
    sort = sort.substr(1);
    isReverse = true;
  }

  shipCollection.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  switch (sort) {
    case 'name':
      shipCollection.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      break;
    case 'hull':
      shipCollection.sort((a, b) => (a.hull > b.hull) ? 1 : ((b.hull > a.hull) ? -1 : 0));
      break;
    case 'class':
      shipCollection.sort((a, b) => (a.class < b.class) ? 1 : ((b.class < a.class) ? -1 : 0));
      break;
    case 'storage':
      shipCollection.sort((a, b) => (a.storage.capacity < b.storage.capacity) ? 1 : ((b.storage.capacity < a.storage.capacity) ? -1 : 0));
      break;
    case 'speed':
      shipCollection.sort((a, b) => (a.speed.forward < b.speed.forward) ? 1 : ((b.speed.forward < a.speed.forward) ? -1 : 0));
      break;
    case 'pitch':
      shipCollection.sort((a, b) => (a.inertia.pitch < b.inertia.pitch) ? 1 : ((b.inertia.pitch < a.inertia.pitch) ? -1 : 0));
      break;
    case 'shield':
      shipCollection.sort((a, b) => (a.shield.max < b.shield.max) ? 1 : ((b.shield.max < a.shield.max) ? -1 : 0));
      break;
    case 'travelSpeed':
      shipCollection.sort((a, b) => (a.speed.travel.speed < b.speed.travel.speed) ? 1 : ((b.speed.travel.speed < a.speed.travel.speed) ? -1 : 0));
      break;
    case 'boostSpeed':
      shipCollection.sort((a, b) => (a.speed.boost.speed < b.speed.boost.speed) ? 1 : ((b.speed.boost.speed < a.speed.boost.speed) ? -1 : 0));
      break;
    case 'missiles':
      shipCollection.sort((a, b) => (a.storage.missile < b.storage.missile) ? 1 : ((b.storage.missile < a.storage.missile) ? -1 : 0));
      break;
    case 'drones':
      shipCollection.sort((a, b) => (a.storage.unit < b.storage.unit) ? 1 : ((b.storage.unit < a.storage.unit) ? -1 : 0));
      break;
    case 'crew':
      shipCollection.sort((a, b) => (a.storage.people < b.storage.people) ? 1 : ((b.storage.people < a.storage.people) ? -1 : 0));
      break;
    case 'weapons':
      shipCollection.sort((a, b) => (a.armaments.weapons.small < b.armaments.weapons.small) ? 1 : ((b.armaments.weapons.small < a.armaments.weapons.small) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.weapons.medium < b.armaments.weapons.medium) ? 1 : ((b.armaments.weapons.medium < a.armaments.weapons.medium) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.weapons.large < b.armaments.weapons.large) ? 1 : ((b.armaments.weapons.large < a.armaments.weapons.large) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.weapons.extralarge < b.armaments.weapons.extralarge) ? 1 : ((b.armaments.weapons.extralarge < a.armaments.weapons.extralarge) ? -1 : 0));
      break;
    case 'turrets':
      shipCollection.sort((a, b) => (a.armaments.turrets.small < b.armaments.turrets.small) ? 1 : ((b.armaments.turrets.small < a.armaments.turrets.small) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.turrets.medium < b.armaments.turrets.medium) ? 1 : ((b.armaments.turrets.medium < a.armaments.turrets.medium) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.turrets.large < b.armaments.turrets.large) ? 1 : ((b.armaments.turrets.large < a.armaments.turrets.large) ? -1 : 0));
      shipCollection.sort((a, b) => (a.armaments.turrets.extralarge < b.armaments.turrets.extralarge) ? 1 : ((b.armaments.turrets.extralarge < a.armaments.turrets.extralarge) ? -1 : 0));
      break;
    case 'dock':
      shipCollection.sort((a, b) => (a.shipstorage.dock_s < b.shipstorage.dock_s) ? 1 : ((b.shipstorage.dock_s < a.shipstorage.dock_s) ? -1 : 0));
      shipCollection.sort((a, b) => (a.shipstorage.dock_m < b.shipstorage.dock_m) ? 1 : ((b.shipstorage.dock_m < a.shipstorage.dock_m) ? -1 : 0));
      break;
    case 'travelTime':
      shipCollection.sort((a, b) => (a.travelTime < b.travelTime) ? 1 : ((b.travelTime < a.travelTime) ? -1 : 0));
      break;
    case 'tradeScore':
      shipCollection.sort((a, b) => (a.tradeScore < b.tradeScore) ? 1 : ((b.tradeScore < a.tradeScore) ? -1 : 0));
      break;
  }
  return isReverse ? shipCollection.reverse() : shipCollection;
}
