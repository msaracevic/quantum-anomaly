import {translate, translateRecursive} from './translations';

const getRace = (name) => {
  if (name.indexOf('arg') !== -1) return 'arg';
  if (name.indexOf('par') !== -1) return 'par';
  if (name.indexOf('spl') !== -1) return 'spl';
  if (name.indexOf('tel') !== -1) return 'tel';
  if (name.indexOf('xen') !== -1) return 'xen';
  if (name.indexOf('kha') !== -1) return 'kha';
  if (name.indexOf('ter') !== -1) return 'ter';
  if (name.indexOf('yak') !== -1) return 'yak';
  if (name.indexOf('atf') !== -1) return 'atf';
  if (name.indexOf('ship_gen_s_fighter_01') !== -1) return 'arg';
};

export function addDataFromMacroFile(data, translations, defaults, storage, shipstorage) {
  const properties = data.macros.macro.properties;
  const connections = data.macros.macro.connections.connection;
  const classOfShip = data.macros.macro.class;

  const ship = {
    id: data.macros.macro.name,
    class: classOfShip,
    race: getRace(data.macros.macro.name),
    name: translate(properties.identification.name, translations, true).replace(/\\/g, ''),
    basename: translateRecursive(properties.identification.basename, translations),
    description: translateRecursive(properties.identification.description, translations).replace(/\(same(.*?)\)/g, ''),
    shortvariation: translateRecursive(properties.identification.shortvariation, translations),
    variation: translateRecursive(properties.identification.variation, translations),
    type: properties.ship.type,
    radarRange: defaults[classOfShip].radarRange,
    docksize: defaults[classOfShip].docksize,
    hull: properties.hull.max,
    shield: {max: 0, rate: 0, delay: 0},
    speed: {forward: 0, acceleration: 0, boost: 0, travel: 0, pitch: 0, roll: 0, yaw: 0},
    armaments: {weapons: {large: 0, medium: 0, small: 0}, turrets: {large: 0, medium: 0, small: 0}},
    storage: {
      unit: properties.storage ? parseFloat(properties.storage.unit) : 0,
      missile: properties.storage ? parseFloat(properties.storage.missile) : 0,
      people: parseFloat(properties.people.capacity),
      countermeasure: parseFloat(defaults[classOfShip].storage.countermeasure),
      deployable: parseFloat(defaults[classOfShip].storage.deployable),
      capacity: 0,
      capacityType: null
    },
    mass: properties.physics.mass,
    inertia: {
      pitch: properties.physics.inertia.pitch,
      yaw: properties.physics.inertia.yaw,
      roll: properties.physics.inertia.roll
    },
    drag: {
      forward: properties.physics.drag.forward,
      reverse: properties.physics.drag.reverse,
      horizontal: properties.physics.drag.horizontal,
      vertical: properties.physics.drag.vertical,
      pitch: properties.physics.drag.pitch,
      yaw: properties.physics.drag.yaw,
      roll: properties.physics.drag.roll
    },
    thrusters: {
      size: properties.thruster.tags
    },
    shipstorage: {
      dock_m: 0,
      dock_s: 0
    }
  };

  Array.isArray(connections) && connections.forEach(connection => {
    if (connection.ref.indexOf('_shipstorage') !== -1) {
      if (connection.macro.ref.indexOf('xs') !== -1) return;
      const shipstorageType = shipstorage[connection.macro.ref].type;
      const shipstorageCapacity = parseInt(shipstorage[connection.macro.ref].capacity, 10);
      ship.shipstorage[shipstorageType] += shipstorageCapacity;
    }
    if (connection.ref.indexOf('_storage') !== -1) {
      ship.storage.capacity = parseFloat(storage[connection.macro.ref].cargo);
      ship.storage.capacityType = storage[connection.macro.ref].type;
    }
  });

  // some things don't have information and we don't want to show this text then at all
  if (ship.description && ship.description.indexOf('No information available') !== -1) ship.description = null;

  // possible variations to filter later on frontend [VA/ST/RD] and self introduced BV for everything else
  if (!ship.shortvariation) {
    if (ship.name.indexOf('Vanguard') !== -1) ship.shortvariation = 'VA';
    else if (ship.name.indexOf('Sentinel') !== -1) ship.shortvariation = 'ST';
    else ship.shortvariation = 'BV';
  }
  // because Split are the only one who have this types, we will unify it under BV, like rest of the ships
  ship.shortvariation = ship.shortvariation.replace('\\(Gas\\)', 'BV').replace('\\(Mineral\\)', 'BV');

  return ship;
}
