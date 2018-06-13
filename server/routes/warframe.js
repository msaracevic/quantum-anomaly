import warframe from '../app/warframe';

export function getWarframeStatus(req, res) {
  warframe().then(data => res.json(data));
}
