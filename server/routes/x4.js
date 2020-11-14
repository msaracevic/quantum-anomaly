import {promises as fs} from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const root = env === 'development' ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');

export async function getShips(req, res) {
  const pathToFile = path.join(root, 'static-files', 'x4', '_ships.json');
  const data = await fs.readFile(pathToFile, 'utf-8');
  const response = {...JSON.parse(data)};
  res.json(response);
}

export async function getEquipment(req, res) {
  const pathToFile = path.join(root, 'static-files', 'x4', '_equipment.json');
  const data = await fs.readFile(pathToFile, 'utf-8');
  const response = {...JSON.parse(data)};
  res.json(response);
}

export async function getMap(req, res) {
  const pathToFile = path.join(root, 'static-files', 'x4', '_map.json');
  const data = await fs.readFile(pathToFile, 'utf-8');
  const response = {...JSON.parse(data)};
  res.json(response);
}
