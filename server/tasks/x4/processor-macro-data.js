import {translate} from './getter-translations';
import {appLog} from '../../helpers/logger';

const getRace = (name) => {
  if (name.indexOf('arg') !== -1) return 'arg';
  if (name.indexOf('par') !== -1) return 'par';
  if (name.indexOf('spl') !== -1) return 'spl';
  if (name.indexOf('tel') !== -1) return 'tel';
  if (name.indexOf('xen') !== -1) return 'xen';
};

export function processMacro(data, translations, defaults, storage, shipstorage) {
  const properties = data.macros.macro.properties;
  const connections = data.macros.macro.connections.connection;
  const classOfShip = data.macros.macro.class;

  const ship = {
    id: data.macros.macro.name,
    class: classOfShip,
    race: getRace(data.macros.macro.name),
    name: translate(properties.identification.name, translations, true),
    basename: translate(properties.identification.basename, translations),
    description: translate(properties.identification.description, translations, false, true),
    shortvariation: translate(properties.identification.shortvariation, translations),
    variation: translate(properties.identification.variation, translations),
    type: properties.ship.type,
    storage: {
      unit: properties.storage ? properties.storage.unit : 0,
      missile: properties.storage ? properties.storage.missile : 0,
      people: properties.people.capacity,
      countermeasure: defaults[classOfShip].storage.countermeasure,
      deployable: defaults[classOfShip].storage.deployable,
      capacity: 0,
      capacityType: null
    },
    radarRange: defaults[classOfShip].radarRange,
    docksize: defaults[classOfShip].docksize,
    hull: properties.hull.max,
    shield: {
      max: 0,
      rate: 0,
      delay: 0
    },
    speed: {
      forward: 0,
      acceleration: 0,
      boost: 0,
      travel: 0
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
      dock_m: {capacity: 0},
      dock_s: {capacity: 0}
    }
  };

  Array.isArray(connections) && connections.forEach(connection => {
    if (connection.ref.indexOf('_shipstorage') !== -1) {
      if (connection.macro.ref.indexOf('xs') !== -1) return;
      const shipstorageType = shipstorage[connection.macro.ref].type;
      const shipstorageCapacity = parseInt(shipstorage[connection.macro.ref].capacity, 10);
      ship.shipstorage[shipstorageType].capacity += shipstorageCapacity;
    }
    if (connection.ref.indexOf('_storage') !== -1) {
      ship.storage.capacity = storage[connection.macro.ref].cargo;
      ship.storage.capacityType = storage[connection.macro.ref].type;
    }
  });

  if (ship.description && ship.description.indexOf('No information available') !== -1) ship.description = null;
  ship.name = ship.name.replace(/\\/g, '');

  appLog(`Processed macro data of ${data.macros.macro.name} (${ship.name})`);
  return ship;
}
