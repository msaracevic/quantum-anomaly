import * as ships from '../app/efs/ships/ships';
import skills from '../app/efs/skills/skills';


export function getAllShips(req, res) {
  ships.getAllShips().then(shipsData => res.json(shipsData));
}

export function getAllSkills(req, res) {
  skills().then(skillsData => res.json(skillsData));
}
