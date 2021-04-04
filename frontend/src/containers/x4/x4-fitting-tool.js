// To use, send pure ship and equipment from store, then pass item ids as array of string, this function will fill out
// the available slots with that item and return modified ship
const int = arg => parseInt(arg, 10);
const float = arg => parseFloat(arg, 10);

export function fillOntoShip(ship, equipment, size, items) {
  const modifiedShip = {...ship};
  items.forEach(item => {
    if (item.indexOf('shield') !== -1) {
      const shield = equipment[size][item].recharge.max;
      modifiedShip.shield = {
        max: int(ship.shields.quantity) * int(shield),
        rate: int(equipment[size][item].recharge.rate),
        delay: int(equipment[size][item].recharge.delay)
      };
    }
    if (item.indexOf('engine') !== -1) {
      const thrust = equipment[size][item].thrust.forward;
      const boost = equipment[size][item].boost.thrust;
      const travel = equipment[size][item].travel.thrust;
      modifiedShip.speed = {
        ...modifiedShip.speed,
        forward: (int(ship.engines.quantity) * float(thrust)) / float(ship.drag.forward),
        acceleration: (int(ship.engines.quantity) * float(thrust)) / float(ship.mass),
        travel: {
          speed: (float(ship.engines.quantity) * float(thrust) * float(travel)) / float(ship.drag.forward),
          attack: float(equipment[size][item].travel.attack),
          charge: float(equipment[size][item].travel.charge),
          release: float(equipment[size][item].travel.release)
        },
        boost: {
          speed: (float(ship.engines.quantity) * float(thrust) * float(boost)) / float(ship.drag.forward),
          attack: float(equipment[size][item].boost.attack),
          duration: float(equipment[size][item].boost.duration),
          release: float(equipment[size][item].boost.release)
        }
      };
    }
    if (item.indexOf('thruster') !== -1) {
      const pitch = equipment[size][item].thrust.pitch;
      const roll = equipment[size][item].thrust.roll;
      const yaw = equipment[size][item].thrust.yaw;
      modifiedShip.speed = {
        ...modifiedShip.speed,
        pitch: (float(pitch)) / float(ship.drag.pitch),
        roll: (float(roll)) / float(ship.drag.roll),
        yaw: (float(yaw)) / float(ship.drag.yaw)
      };
    }
  });
  return modifiedShip;
}
