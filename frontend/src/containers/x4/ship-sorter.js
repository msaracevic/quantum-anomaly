export function sortShips(ships, sort) {
  if (!sort) return ships;

  const shipCollection = [...ships];

  switch (sort) {
    case 'name':
      shipCollection.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      break;
    case '-name':
      shipCollection.sort((a, b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0));
      break;
    case 'class':
      shipCollection.sort((a, b) => (a.class < b.class) ? 1 : ((b.class < a.class) ? -1 : 0));
      break;
    case '-class':
      shipCollection.sort((a, b) => (a.class > b.class) ? 1 : ((b.class > a.class) ? -1 : 0));
      break;
    case 'storage':
      shipCollection.sort((a, b) => (a.storage.capacity < b.storage.capacity) ? 1 : ((b.storage.capacity < a.storage.capacity) ? -1 : 0));
      break;
    case '-storage':
      shipCollection.sort((a, b) => (a.storage.capacity > b.storage.capacity) ? 1 : ((b.storage.capacity > a.storage.capacity) ? -1 : 0));
      break;
    case 'speed':
      shipCollection.sort((a, b) => (a.speed.forward < b.speed.forward) ? 1 : ((b.speed.forward < a.speed.forward) ? -1 : 0));
      break;
    case '-speed':
      shipCollection.sort((a, b) => (a.speed.forward > b.speed.forward) ? 1 : ((b.speed.forward > a.speed.forward) ? -1 : 0));
      break;
    case 'travelSpeed':
      shipCollection.sort((a, b) => (a.speed.travel < b.speed.travel) ? 1 : ((b.speed.travel < a.speed.travel) ? -1 : 0));
      break;
    case '-travelSpeed':
      shipCollection.sort((a, b) => (a.speed.travel > b.speed.travel) ? 1 : ((b.speed.travel > a.speed.travel) ? -1 : 0));
      break;
    case 'travelTime':
      shipCollection.sort((a, b) => (a.travelTime < b.travelTime) ? 1 : ((b.travelTime < a.travelTime) ? -1 : 0));
      break;
    case '-travelTime':
      shipCollection.sort((a, b) => (a.travelTime > b.travelTime) ? 1 : ((b.travelTime > a.travelTime) ? -1 : 0));
      break;
    case 'tradeScore':
      shipCollection.sort((a, b) => (a.tradeScore < b.tradeScore) ? 1 : ((b.tradeScore < a.tradeScore) ? -1 : 0));
      break;
    case '-tradeScore':
      shipCollection.sort((a, b) => (a.tradeScore > b.tradeScore) ? 1 : ((b.tradeScore > a.tradeScore) ? -1 : 0));
      break;
  }
  return shipCollection;
}
