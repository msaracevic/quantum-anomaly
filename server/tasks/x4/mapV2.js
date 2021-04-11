import path from 'path';
import xml2js from 'xml2js';
import {promises as fs} from 'fs';
import {translateRecursiveTrim} from './translations';
import {saveToFile} from './helpers';
import {roundToClosest} from '../../helpers';

/*
    Things to keep in mind.
    - Most of these things are built upon layers, so order of executions most likely plays a role.
    - Most if else cases can not be combined, due to fact that they are not that explicit, it is used to isolate a
      subset of possible candidates, do something with it, then if else another isolated subset, etc...
    - Most of the code here actually mutates same objects, so take care not to actually deconstruct something
 */

const SAVE_SUBSTEPS = true;

async function parseFile(pathToFile) {
  const parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});
  return await parser.parseStringPromise(await fs.readFile(pathToFile));
}

function processMapDefaults(mapDefaults, translations) {
  mapDefaults = mapDefaults.filter(item => item.macro.includes('Cluster') && !item.macro.includes('demo'));
  mapDefaults = mapDefaults.map(item => {
    item.properties.name = translateRecursiveTrim(item.properties.identification.name, translations);
    item.properties.identification.description = translateRecursiveTrim(item.properties.identification.description, translations);
    if (item.properties.area) {
      item.properties.area.sunlight = parseFloat(item.properties.area.sunlight);
      item.properties.area.economy = parseFloat(item.properties.area.economy);
      item.properties.area.security = parseFloat(item.properties.area.security);

    }
    delete item.properties.identification;
    delete item.properties.sounds;
    delete item.properties.system;
    delete item.properties.worlds;
    return item;
  });
  return mapDefaults;
}

function processGalaxy(galaxy) {
  galaxy.forEach(galaxyItem => {
    if (galaxyItem.ref === 'clusters' && galaxyItem.macro.connection === 'galaxy') {
      if (!galaxyItem.offset) galaxyItem.offset = {position: {x: 0, y: 0, z: 0}};
      else galaxyItem.offset.position = {
        x: parseInt(galaxyItem.offset.position.x, 10) / 80000,
        y: parseInt(galaxyItem.offset.position.y, 10) / 80000,
        z: parseInt(galaxyItem.offset.position.z, 10) / 80000
      };
    }
  });
  return galaxy;
}

function processClusters(clusters) {
  clusters.forEach(clusterItem => clusterItem.connections.connection.forEach(clusterConnection => {
    if (!clusterConnection.offset || !clusterConnection.offset.position)
      clusterConnection.offset = {position: {x: 0, y: 0, z: 0}};
    else clusterConnection.offset.position = {
      x: parseInt(clusterConnection.offset.position.x, 10) / 80000,
      y: parseInt(clusterConnection.offset.position.y, 10) / 80000,
      z: parseInt(clusterConnection.offset.position.z, 10) / 80000
    };
  }));
  return clusters;
}

function processSectors(sectors) {
  const sectorsObjects = {};
  sectors.forEach(sector => {
    sector.connections.connection.forEach(connection => {
      sectorsObjects[connection.name] = connection;
    });
  });
  return sectorsObjects;
}

function processRegionYields(regionYields) {
  const regionYieldsObject = {};
  regionYields.regionyields.resource.forEach(resource => {
    const yields = {};
    resource.yield.forEach(item => {
      yields[item.name] = {
        resourcedensity: parseFloat(item.resourcedensity),
        replenishtime: parseFloat(item.replenishtime),
        scaneffectintensity: parseFloat(item.scaneffectintensity)
      };
      if (item.gatherspeedfactor) yields[item.name].gatherspeedfactor = parseFloat(item.gatherspeedfactor);
    });

    regionYieldsObject[resource.ware] = {...yields};
  });
  return regionYieldsObject;
}

function processRegionObjectGroups(regionObjects) {
  const regionObjectGroupsObject = {};
  regionObjects.groups.group.forEach(item => {
    if (item.yield) regionObjectGroupsObject[item.name] = {
      resource: item.resource,
      yield: parseFloat(item.yield),
      yieldvariation: parseFloat(item.yieldvariation)
    };
  });
  return regionObjectGroupsObject;
}

function processRegions(regions, regionObjectGroupsObject, regionYieldsObject) {
  regions = regions.filter(region =>
    !region.name.includes('test') &&
    region.resources &&
    region.name !== 'cluster113_region02' &&
    region.name !== 'region_cluster_414_sector_001' &&
    region.name !== 'region_cluster_418_sector_001_b' &&
    region.name !== 'region_cluster_418_sector_001_c' &&
    region.name !== 'region_cluster_421_sector_001'
  );

  regions.forEach(region => {
    if (region.density) region.density = parseFloat(region.density);
    if (region.rotation) region.rotation = parseFloat(region.rotation);
    if (region.noisescale) region.noisescale = parseFloat(region.noisescale);
    if (region.seed) region.seed = parseFloat(region.seed);
    if (region.minnoisevalue) region.minnoisevalue = parseFloat(region.minnoisevalue);
    if (region.maxnoisevalue) region.maxnoisevalue = parseFloat(region.maxnoisevalue);
    if (region.boundary.size.r) region.boundary.size.r = parseFloat(region.boundary.size.r);
    if (region.boundary.size.linear) region.boundary.size.linear = parseFloat(region.boundary.size.linear);
    if (region.boundary.size.class === 'box') region.boundary.size = {
      x: parseFloat(region.boundary.size.x),
      y: parseFloat(region.boundary.size.y),
      z: parseFloat(region.boundary.size.z)
    };
    if (region.boundary.class === 'splinetube') {
      region.boundary.splineposition = region.boundary.splineposition.map(item => {
        item = {
          x: parseFloat(item.x), y: parseFloat(item.y), z: parseFloat(item.z),
          tx: parseFloat(item.tx), ty: parseFloat(item.ty), tz: parseFloat(item.tz),
          inlength: parseFloat(item.inlength), outlength: parseFloat(item.outlength)
        };
        return item;
      });
    }
    if (region.falloff) {
      if (region.falloff.lateral) region.falloff.lateral.step = region.falloff.lateral.step.map(item => {
        item.position = parseFloat(item.position);
        item.value = parseFloat(item.value);
        return item;
      });
      if (region.falloff.radial) region.falloff.radial.step = region.falloff.radial.step.map(item => {
        item.position = parseFloat(item.position);
        item.value = parseFloat(item.value);
        return item;
      });
    }
    delete region.falloff; // TODO: remove this
    if (region.fields.asteroid) {
      if (!Array.isArray(region.fields.asteroid)) region.fields.asteroid = [region.fields.asteroid];
      region.fields.asteroid = region.fields.asteroid.filter(item => {
        let keep = true;
        if (!item.groupref) keep = false;
        if (item.groupref && item.groupref.includes('xenon')) keep = false;
        return keep;
      });
      region.fields.asteroid = region.fields.asteroid.map(item => {
        return {
          densityfactor: parseFloat(item.densityfactor),
          rotation: parseFloat(item.rotation),
          rotationvariation: parseFloat(item.rotationvariation),
          noisescale: parseFloat(item.noisescale),
          seed: parseFloat(item.seed),
          minnoisevalue: parseFloat(item.minnoisevalue),
          maxnoisevalue: parseFloat(item.maxnoisevalue),
          resource: regionObjectGroupsObject[item.groupref].resource,
          yield: regionObjectGroupsObject[item.groupref].yield,
          yieldvariation: regionObjectGroupsObject[item.groupref].yieldvariation
        };
      });
    }
    if (region.fields.nebula) {
      if (!Array.isArray(region.fields.nebula)) region.fields.nebula = [region.fields.nebula];
      region.fields.nebula = region.fields.nebula.filter(item => item.resources);
      region.fields.nebula = region.fields.nebula.map(item => {
        return {
          ref: item.ref,
          localred: parseFloat(item.localred),
          localgreen: parseFloat(item.localgreen),
          localblue: parseFloat(item.localblue),
          localdensity: parseFloat(item.localdensity),
          uniformred: parseFloat(item.uniformred),
          uniformgreen: parseFloat(item.uniformgreen),
          uniformblue: parseFloat(item.uniformblue),
          uniformdensity: parseFloat(item.uniformdensity),
          backgroundfog: item.backgroundfog,
          resources: item.resources
        };
      });
    }
    if (region.resources) {
      const resourcesObject = {};
      if (!Array.isArray(region.resources.resource)) region.resources.resource = [region.resources.resource];
      region.resources.resource.forEach(item => resourcesObject[item.ware] = regionYieldsObject[item.ware][item.yield]);
      region.resources = resourcesObject;
    }
    delete region.fields.volumetricfog;
    delete region.fields.object;
    delete region.fields.positional;
    delete region.fields.debris;
  });
  return regions;
}

function processResourcesInField(regionDefinitions) {
  const resourcesInFieldObject = {};
  const highestValues = {};
  const wares = ['ore', 'silicon', 'ice', 'nividium', 'helium', 'methane', 'hydrogen'];

  wares.forEach(ware => highestValues[ware] = 0);

  regionDefinitions.forEach(item => {
    resourcesInFieldObject[item.name] = {
      boundary: item.boundary
    };

    let totalVolume = 1;
    const fieldDensity = item.density;

    if (item.boundary.class === 'cylinder') {
      totalVolume = 3.14 * Math.pow((item.boundary.size.r / 1000), 2) * (item.boundary.size.linear / 1000);
    } else if (item.boundary.class === 'box') {
      totalVolume = (item.boundary.size.x / 1000) * (item.boundary.size.y / 1000) * (item.boundary.size.z / 1000);
    } else if (item.boundary.class === 'sphere') {
      totalVolume = 4 / 3 * 3.14 * Math.pow((item.boundary.size.r / 1000), 3);
    } else if (item.boundary.class === 'splinetube') {
      const totalLength = item.boundary.splineposition.reduce((acc, currentValue, index) => {
        const x = Math.pow(currentValue.x - item.boundary.splineposition[index - 1].x, 2);
        const y = Math.pow(currentValue.y - item.boundary.splineposition[index - 1].y, 2);
        const z = Math.pow(currentValue.z - item.boundary.splineposition[index - 1].z, 2);
        return Math.sqrt(x + y + z);
      });
      totalVolume = 3.14 * Math.pow((item.boundary.size.r / 1000), 2) * totalLength;
    }

    resourcesInFieldObject[item.name].volume = totalVolume;
    if (totalVolume > Math.pow(300, 3)) totalVolume = Math.pow(300, 3);

    const resources = {};
    if (item.fields.asteroid) item.fields.asteroid.forEach(asteroid => {
      const resource = asteroid.resource;
      const asteroidYield = asteroid.densityfactor * ((asteroid.minnoisevalue + asteroid.maxnoisevalue) / 2) * asteroid.yield;
      const adjustedYield = asteroidYield * item.resources[resource].resourcedensity * totalVolume * fieldDensity;
      if (!resources[resource]) resources[resource] = 0;
      resources[resource] += Math.floor(adjustedYield);
    });
    if (item.fields.nebula) item.fields.nebula.forEach(nebula => {
      const nebulaResources = nebula.resources.split(' ');
      nebulaResources.forEach(resource => {
        const adjustedYield = item.resources[resource].resourcedensity * item.resources[resource].gatherspeedfactor * totalVolume * fieldDensity;
        if (!resources[resource]) resources[resource] = 0;
        resources[resource] += Math.floor(adjustedYield);
      });
    });

    resourcesInFieldObject[item.name].resources = resources;
    wares.forEach(ware => {
      if (resources[ware] && resources[ware] > highestValues[ware]) highestValues[ware] = resources[ware];
    });
  });

  Object.keys(resourcesInFieldObject).forEach(key => {
    wares.forEach(ware => {
      if (resourcesInFieldObject[key].resources[ware]) {
        // since some regions in game are enormous and way out of bounds of sector, they will skew results
        // hence we divide the highest value by 2 to and block the value at 99 being max
        // this causes few sectors to be able to "reach" maximum yield
        const weightedTop = Math.ceil(resourcesInFieldObject[key].resources[ware] / (highestValues[ware]) * 100);
        resourcesInFieldObject[key].relativeResources = {
          ...resourcesInFieldObject[key].relativeResources,
          [ware]: weightedTop > 99 ? 99 : weightedTop
        };
        resourcesInFieldObject[key].relativeResources.volume = 0;
        resourcesInFieldObject[key].relativeResources.volume = resourcesInFieldObject[key].volume > Math.pow(300, 3)
          ? Math.pow(300, 3)
          : roundToClosest(resourcesInFieldObject[key].volume);
      }
    });
  });

  return resourcesInFieldObject;
}

function applyCrazySectorTransformations(map, sectorsObjects) {
  // since we are dealing with hexagons, there are few positions sector can take
  /*
           -----------               -----------
         /             \           /          6  \
        /  1         2  \         /               \
       /                 \       / 5               \
       \                 /       \                 /
        \  4         3  /         \               /
         \             /           \          7  /
          ------------              ------------
       For 2 sectors in cluster, we need to compare their relative positions
       The first sector will always be 0,0,0, we need to compare that to the next sector and then decide
       based on that, in which spot we will put the first and the second one
       For 3 sectors in cluster, we can use pretty much same approach, but they are arranged slightly different

       We can also add the base cluster position in galaxy to be able to draw it on same galaxy layer without
       having to nest it into clusters loop

       For one sector, just make the sectors position same as cluster...
       For two sectors, figure out relative positions of second to first, yes, this is messy shotgun development, but...
       For three sectors, there is only one instance of these in game, so, hardcode it...
   */

  map.forEach(cluster => {
    if (cluster.sectors.length === 1) cluster.sectors[0].adjusted = cluster.position;

    if (cluster.sectors.length === 2) {
      cluster.sectors[0].adjusted = {...cluster.position};
      cluster.sectors[1].adjusted = {...cluster.position};
      // It is very very tempting to group these, but due to all the factors it gets really tricky
      // Better leave as this, it is ugly, but it has cascading if else effect and it's actually very safe way
      // of checking things
      if (cluster.sectors[0].position.x === 0 && cluster.sectors[0].position.z === 0 && cluster.sectors[1].position.x === 0 && cluster.sectors[1].position.z > 0) {
        cluster.sectors[0].adjusted = {x: cluster.position.x + 32, z: cluster.position.z - 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x - 32, z: cluster.position.z + 54};
        cluster.sectors[0].transformation = 'A';
        cluster.sectors[1].transformation = 'A';
      } else if (cluster.sectors[0].position.x === 0 && cluster.sectors[0].position.z === 0 && cluster.sectors[1].position.x === 0 && cluster.sectors[1].position.z < -2000) {
        cluster.sectors[0].adjusted = {x: cluster.position.x - 32, z: cluster.position.z + 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x + 32, z: cluster.position.z - 54};
        cluster.sectors[0].transformation = 'B';
        cluster.sectors[1].transformation = 'B';
      } else if (cluster.sectors[0].position.x === 0 && cluster.sectors[0].position.z === 0 && cluster.sectors[1].position.x === 0 && cluster.sectors[1].position.z < 0) {
        cluster.sectors[0].adjusted = {x: cluster.position.x + 32, z: cluster.position.z + 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x - 32, z: cluster.position.z - 54};
        cluster.sectors[0].transformation = 'C';
        cluster.sectors[1].transformation = 'C';
      } else if (cluster.sectors[1].position.x < 0) {
        cluster.sectors[0].adjusted.x = cluster.position.x + 32;
        cluster.sectors[1].adjusted.x = cluster.position.x - 32;
        if (cluster.sectors[1].position.z < 0) {
          cluster.sectors[0].adjusted.z = cluster.position.z + 54;
          cluster.sectors[1].adjusted.z = cluster.position.z - 54;
          cluster.sectors[0].transformation = 'D';
          cluster.sectors[1].transformation = 'D';
        } else if (cluster.sectors[1].position.z > 0) {
          cluster.sectors[0].adjusted.z = cluster.position.z - 54;
          cluster.sectors[1].adjusted.z = cluster.position.z + 54;
          cluster.sectors[0].transformation = 'E';
          cluster.sectors[1].transformation = 'E';
        }
      } else if (cluster.sectors[1].position.x > 0 && cluster.sectors[1].position.z > 0) {
        cluster.sectors[0].adjusted = {x: cluster.position.x - 32, z: cluster.position.z - 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x + 32, z: cluster.position.z + 54};
        cluster.sectors[0].transformation = 'F';
        cluster.sectors[1].transformation = 'F';
      } else if (cluster.sectors[1].position.x > 0 && cluster.sectors[1].position.z < 0) {
        cluster.sectors[0].adjusted = {x: cluster.position.x - 32, z: cluster.position.z + 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x + 32, z: cluster.position.z - 54};
        cluster.sectors[0].transformation = 'G';
        cluster.sectors[1].transformation = 'G';
      } else if (cluster.sectors[1].position.z === 0) {
        cluster.sectors[0].adjusted = {x: cluster.position.x - 32, z: cluster.position.z - 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x + 32, z: cluster.position.z + 54};
        cluster.sectors[0].transformation = 'H';
        cluster.sectors[1].transformation = 'H';
        // special flake
        if (cluster.id === 'Cluster_42_macro') {
          cluster.sectors[0].adjusted = {x: cluster.position.x - 32, z: cluster.position.z + 54};
          cluster.sectors[1].adjusted = {x: cluster.position.x + 32, z: cluster.position.z - 54};
          cluster.sectors[0].transformation = 'I';
          cluster.sectors[1].transformation = 'I';
        }
      }
    }
    if (cluster.sectors.length === 3) {
      cluster.sectors[0].adjusted = cluster.position;
      cluster.sectors[1].adjusted = cluster.position;
      cluster.sectors[2].adjusted = cluster.position;
      // special flake
      if (cluster.id === 'Cluster_01_macro') {
        cluster.sectors[0].adjusted = {x: cluster.position.x + 32, z: cluster.position.z - 54};
        cluster.sectors[2].adjusted = {x: cluster.position.x + 32, z: cluster.position.z + 54};
        cluster.sectors[1].adjusted = {x: cluster.position.x - 62, z: cluster.position.z};
        cluster.sectors[0].transformation = 'S';
        cluster.sectors[1].transformation = 'S';
        cluster.sectors[2].transformation = 'S';
      }
    }

    cluster.sectors.forEach(sector => sector.zones && sector.zones.forEach(zone => {
      const inSectorDivider = !sector.transformation ? 3000 : 6000;
      const zoneInSectorPosition = sectorsObjects[zone.zoneReference.replace('macro', 'connection')].offset.position;
      zone.adjustedInSector = {
        x: sector.adjusted.x + zoneInSectorPosition.x / inSectorDivider,
        z: sector.adjusted.z + zoneInSectorPosition.z / inSectorDivider
      };
      zone.adjusted = {
        x: zone.adjustedInSector.x + zone.offset.position.x / 3500,
        z: zone.adjustedInSector.z + zone.offset.position.z / 3500
      };
      delete zone.adjustedInSector;
      delete zone.position;
    }));


    cluster.sectors.forEach(sector => sector.stations && sector.stations.forEach(station => {
      const inSectorDivider = !sector.transformation ? 3000 : 6000;
      if (!sectorsObjects[station.zoneReference.replace('macro', 'connection')])
        sectorsObjects[station.zoneReference.replace('macro', 'connection')] = {offset: {position: {x: 0, z: 0}}};
      const zoneInSectorPosition = sectorsObjects[station.zoneReference.replace('macro', 'connection')].offset.position;
      if (!station.offset) station.offset = {position: {x: 0, z: 0}};
      station.adjustedInSector = {
        x: sector.adjusted.x + zoneInSectorPosition.x / inSectorDivider,
        z: sector.adjusted.z + zoneInSectorPosition.z / inSectorDivider
      };
      station.adjusted = {
        x: station.adjustedInSector.x + station.offset.position.x / 3500,
        z: station.adjustedInSector.z + station.offset.position.z / 3500
      };
      // since some of these things are literally on top of each other, do some "adjustment"
      if (station.id === 'shipyard_holyorder') station.adjusted.x -= 20;
      else if (station.id === 'shipyard_antigone' || station.id === 'tradestation_antigone') station.adjusted.z -= 10;
      else if (station.id === 'wharf_xenon_cluster_424' || station.id === 'shipyard_xenon_cluster_112' || station.id === 'shipyard_paranid' || station.id === 'wharf_freesplit_01' || station.id === 'wharf_split_01' || station.id === 'wharf_xenon_cluster_415' || station.id === 'ter_shipyard_cluster_104_sector002' || station.id === 'ter_wharf_cluster_101_sector001') {
        station.adjusted.x += 20;
        station.adjusted.z += 5;
      } else if (station.id === 'equipmentdock_ministry_01') {
        station.adjusted.x += 20;
        station.adjusted.z -= 10;
      } else if (station.id === 'wharf_teladi_01') {
        station.adjusted.x -= 20;
        station.adjusted.z += 5;
      }
      delete station.adjustedInSector;
      delete station.position;
    }));
  });
  return map;
}

// Cluster_XX[X]_SectorYYY_macro
function getRegionSectorReferenceById(arg) {
  // Because old files have different namings then new ones, do some weird stuff... For old files we have
  // something like C01S01, for new ones we have Cluster100_Sector001, we want to unify it all
  let name = arg.replace('Cluster', 'C').replace('_Sector0', 'S').split('_')[0];
  const clusterID = name.match(/C(.*)S/)[1];
  const sectorID = '0' + name.match(/S(.*)/)[1];
  name = `Cluster_${clusterID}_Sector${sectorID}_macro`;
  return name;
}

function calculatePerSectorYields(map) {
  map.forEach(cluster => {
    if (cluster.regions) {
      cluster.sectors.forEach(sector => {
        const items = ['ore', 'silicon', 'ice', 'nividium', 'helium', 'methane', 'hydrogen', 'volume'];
        sector.resources = {};
        sector.relativeResources = {};
        cluster.regions[sector.id] && cluster.regions[sector.id].forEach(region => items.forEach(item => {
          if (region.relativeResources && region.relativeResources[item]) {
            if (!sector.relativeResources[item]) sector.relativeResources[item] = 0;
            sector.relativeResources[item] += region.relativeResources[item];
          }
          if (region.resources && region.resources[item]) {
            if (!sector.resources[item]) sector.resources[item] = 0;
            sector.resources[item] += region.resources[item];
          }
        }));
      });
    }
  });
  return map;
}

function processZones(zones, components) {
  const zonesObject = {};
  zones = zones.filter(zone => zone.connections);
  zones = zones.filter(zone => zone.connections.connection);
  zones.forEach(zone => {
    // ZoneZZZ_Cluster_XXX_SectorYYY_macro ==> Cluster_XX[X]_SectorYYY_macro
    let sectorReference = zone.name.split('_');
    sectorReference.shift();
    sectorReference = sectorReference.join('_');
    if (zone.name.toLowerCase().includes('tzone')) {
      zone.connections.connection.offset = components[zone.connections.connection.ref].offset;
      sectorReference.replace('tzone', '');
    }
    if (!Array.isArray(zone.connections.connection)) zone.connections.connection = [zone.connections.connection];
    zone.connections.connection.forEach(connection => {
      connection.zoneReference = zone.name;
      connection.offset.position = {
        x: parseFloat(connection.offset.position.x),
        y: parseFloat(connection.offset.position.y),
        z: parseFloat(connection.offset.position.z)
      };
    });
    delete zone.class;
    delete zone.component;
    if (!zonesObject[sectorReference]) zonesObject[sectorReference] = [];
    zonesObject[sectorReference].push(
      ...zone.connections.connection.filter(connection => connection.ref !== 'anything')
    );
  });
  return zonesObject;
}

function processComponents(components) {
  const componentsObject = {};
  components.forEach(component => {
    if (component.name === 'standardzone') {
      component.connections.connection.forEach(connection => {
        if (connection.tags === 'sechighway' && connection.offset) {
          componentsObject[connection.name] = connection;
        }
      });
    }
  });
  return componentsObject;
}

function calculateConnections(map, gateDestinations) {
  const connections = {gates: []};
  const gates = {};
  map.forEach(clusters => clusters.sectors.forEach(sector => sector.zones && sector.zones.forEach(zone => {
    if (zone.ref === 'gates') {
      if (zone.name === 'connection_ClusterGate034to420') zone.name = 'connection_ClusterGate034To420';
      gates[zone.name] = zone;
    }
  })));
  Object.keys(gateDestinations).forEach(source => {
    connections.gates.push({
      source: source,
      gateDestinations: gateDestinations[source],
      start: gates[source].adjusted,
      end: gates[gateDestinations[source]].adjusted
    });
  });
  return connections;
}

function processStations(stations) {
  const stationsFiltered = {};
  stations.forEach(station => {
    if (
      station.id.indexOf('shipyard') !== -1 ||
      station.id.indexOf('wharf') !== -1 ||
      station.id.indexOf('equipmentdock') !== -1 ||
      station.id.indexOf('tradestation') !== -1 ||
      station.type === 'tradingstation'
    ) {
      const cluster = station.location.macro.match(/cluster_(.*?)_/)[1];
      const sector = station.location.macro.match(/sector(.*?)_/)[1];
      const sectorId = `Cluster_${cluster}_Sector${sector}_macro`;
      if (!stationsFiltered[sectorId]) stationsFiltered[sectorId] = [];
      stationsFiltered[sectorId].push({
        id: station.id,
        race: station.race,
        owner: station.owner,
        tags: station.type === 'tradingstation' ? 'tradestation' : station.station.select.tags.replace(/\[/, '').replace(/]/, ''),
        position: station.position,
        zoneReference: station.location.macro.replace('zon', 'Zon').replace('clu', 'Clu').replace('sec', 'Sec')
      });
    }
  });
  return stationsFiltered;
}

function calculateSectorOwners(stations) {
  const sectorOwners = {};
  stations.forEach(station => {
    if (
      station.id.indexOf('shipyard') !== -1 ||
      station.id.indexOf('defence') !== -1 ||
      station.id.indexOf('wharf') !== -1 ||
      station.id.indexOf('equipmentdock') !== -1 ||
      station.id.indexOf('tradestation') !== -1 ||
      station.type === 'tradingstation'
    ) {
      const cluster = station.location.macro.match(/cluster_(.*?)_/)[1];
      const sector = station.location.macro.match(/sector(.*?)_/)[1];
      const sectorId = `Cluster_${cluster}_Sector${sector}_macro`;
      if (station.station.select && !sectorOwners[sectorId])
        sectorOwners[sectorId] = station.station.select.faction;
      else if (!sectorOwners[sectorId])
        sectorOwners[sectorId] = station.owner;
    }
  });
  return sectorOwners;
}

export async function getMapV2(sourceBasePath, translations) {
  const baseSourcePath = sourceBasePath;
  const splitSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_split');
  const terranSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_terran');
  let base, split, terran;
  let map = [];

  // ----------------------------------------------------------------------------------- mapDefaults - DONE
  // From mapDefaults we can be sure to pick up each cluster and sector in game
  // This will provide base macro names, name, description, sunlight,
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'mapdefaults.xml'));
  split = await parseFile(path.join(splitSourcePath, 'libraries', 'mapdefaults.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'libraries', 'mapdefaults.xml'));

  const mapDefaultsObjects = {};
  processMapDefaults([...base.defaults.dataset, ...split.defaults.dataset, ...terran.defaults.dataset], translations)
    .forEach(item => mapDefaultsObjects[item.macro] = item.properties);
  SAVE_SUBSTEPS && await saveToFile(mapDefaultsObjects, 'mapStepMapDefaults');

  // ----------------------------------------------------------------------------------- galaxy - DONE
  // From galaxy we can find connections of clusters to the galaxy layer and connection between gates
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));

  let galaxyConnections = processGalaxy([
    ...base.macros.macro.connections.connection,
    ...split.diff.add.connection,
    ...terran.diff.add.connection
  ]);
  SAVE_SUBSTEPS && await saveToFile(galaxyConnections, 'mapStepGalaxyConnections');

  // once we have all the galaxy connections, we can just pick out the gate connections and then remove them from
  // galaxyItems
  const gateDestinations = {};
  galaxyConnections.forEach(item => {
    if (item.ref === 'destination') {
      const source = item.path.split('/');
      const destination = item.macro.path.split('/');
      gateDestinations[source[source.length - 1]] = destination[destination.length - 1];
    }
  });
  galaxyConnections = galaxyConnections.filter(item => item.ref !== 'destination');
  SAVE_SUBSTEPS && await saveToFile(gateDestinations, 'mapStepGateDestinations');

  // ----------------------------------------------------------------------------------- clusters
  // From clusters we can find connections of sectors to the cluster layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'clusters.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_clusters.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_clusters.xml'));

  const clusterConnections = {};
  processClusters([...base.macros.macro, ...split.macros.macro, ...terran.macros.macro])
    .forEach(item => clusterConnections[item.name] = item.connections.connection);
  SAVE_SUBSTEPS && await saveToFile(clusterConnections, 'mapStepClusterConnections');

  // ----------------------------------------------------------------------------------- sectors
  // From sectors we can find connections of zones to the sector layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'sectors.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_sectors.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_sectors.xml'));
  const sectorObjects = processSectors([
    ...base.macros.macro,
    ...split.macros.macro,
    ...terran.macros.macro
  ]);
  SAVE_SUBSTEPS && await saveToFile(sectorObjects, 'mapStepSectors');


  // ----------------------------------------------------------------------------------- regionDefinitions
  // From regionDefinitions we can find resource definitions and convert them to object for reference
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'region_definitions.xml'));
  split = await parseFile(path.join(splitSourcePath, 'libraries', 'region_definitions.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'libraries', 'region_definitions.xml'));

  // We also need to feed regionYields to get the yield modifiers
  const regionYields = await parseFile(path.join(baseSourcePath, 'libraries', 'regionyields.xml'));
  const regionYieldsObject = processRegionYields(regionYields);
  SAVE_SUBSTEPS && await saveToFile(regionYieldsObject, 'mapStepRegionYields');

  // We also need to feed regionObjectGroups to get the actual yield of each asteroid
  const regionObjectGroups = await parseFile(path.join(baseSourcePath, 'libraries', 'regionobjectgroups.xml'));
  const regionObjectGroupsObject = processRegionObjectGroups(regionObjectGroups);
  SAVE_SUBSTEPS && await saveToFile(regionObjectGroupsObject, 'mapStepRegionObjectGroups');

  const regionDefinitions = processRegions([
    ...base.regions.region,
    ...split.regions.region,
    ...terran.regions.region
  ], regionObjectGroupsObject, regionYieldsObject);
  SAVE_SUBSTEPS && await saveToFile(regionDefinitions, 'mapStepRegionDefinitions');

  // Once we have all that, we can calculate details for each thing
  const resourcesInFieldObject = processResourcesInField(regionDefinitions);
  SAVE_SUBSTEPS && await saveToFile(resourcesInFieldObject, 'mapStepResourcesInField');


  // ----------------------------------------------------------------------------------- components
  // From components we get some offsets for sector highways
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'component.xml'));
  const components = processComponents(base.components.component);
  SAVE_SUBSTEPS && await saveToFile(components, 'mapStepComponents');

  // ----------------------------------------------------------------------------------- zones
  // From zones we can find connections of gates to the zone layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'zones.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_zones.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_zones.xml'));
  const zones = processZones([
    ...base.macros.macro,
    ...split.macros.macro,
    ...terran.macros.macro
  ], components);
  SAVE_SUBSTEPS && await saveToFile(zones, 'mapStepZones');

  // ----------------------------------------------------------------------------------- stations
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'god.xml'));
  split = await parseFile(path.join(splitSourcePath, 'libraries', 'god.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'libraries', 'god.xml'));
  const splitDlcStations = split.diff.add.filter(item => item.sel === '/god/stations');
  const terranDlcStations = terran.diff.add.filter(item => item.sel === '/god/stations');

  const stations = processStations([
    ...base.god.stations.station,
    ...splitDlcStations[0].station,
    ...terranDlcStations[0].station
  ]);
  const sectorOwners = calculateSectorOwners([
    ...base.god.stations.station,
    ...splitDlcStations[0].station,
    ...terranDlcStations[0].station
  ]);
  SAVE_SUBSTEPS && await saveToFile(stations, 'mapStepStations');

  // from each galaxyItem we can pick up connection which describes where cluster is connected to galaxy
  galaxyConnections.forEach(galaxyConnection => {
    if (galaxyConnection.ref === 'clusters') {
      const cluster = {
        id: galaxyConnection.macro.ref,
        ...mapDefaultsObjects[galaxyConnection.macro.ref],
        ...galaxyConnection.offset
      };
      cluster.sectors = [];
      cluster.sechighways = [];

      clusterConnections[galaxyConnection.macro.ref].forEach(clusterObjectsItem => {
        if (clusterObjectsItem.ref === 'sectors') cluster.sectors.push({
          id: clusterObjectsItem.macro.ref,
          ...mapDefaultsObjects[clusterObjectsItem.macro.ref],
          ...clusterObjectsItem.offset,
          zones: zones[clusterObjectsItem.macro.ref],
          stations: stations[clusterObjectsItem.macro.ref],
          owner: sectorOwners[clusterObjectsItem.macro.ref]
        });
        if (clusterObjectsItem.ref === 'sechighways') cluster.sechighways.push({
          id: clusterObjectsItem.macro.ref,
          ...mapDefaultsObjects[clusterObjectsItem.macro.ref],
          ...clusterObjectsItem.offset,
          ...clusterObjectsItem.macro.connections
        });
        if (clusterObjectsItem.ref === 'regions') {
          let shouldBeAdded = true;
          if (clusterObjectsItem.name && clusterObjectsItem.name.includes('Audio')) shouldBeAdded = false;
          if (clusterObjectsItem.macro.properties.region.ref.includes('audio')) shouldBeAdded = false;
          if (shouldBeAdded) {
            const sectorReference = getRegionSectorReferenceById(clusterObjectsItem.macro.name);
            if (!cluster.regions) cluster.regions = {};
            if (!cluster.regions[sectorReference]) cluster.regions[sectorReference] = [];
            cluster.regions[sectorReference].push({
              id: clusterObjectsItem.macro.name,
              ...clusterObjectsItem.offset,
              ...clusterObjectsItem.macro.properties.region,
              ...resourcesInFieldObject[clusterObjectsItem.macro.properties.region.ref]
            });
          }
        }
      });

      map.push(cluster);
    }
  });

  map = applyCrazySectorTransformations(map, sectorObjects);
  map = calculatePerSectorYields(map);
  const connections = calculateConnections(map, gateDestinations);
  map.forEach(clusters => delete clusters.regions);
  return {clusters: map, connections: connections};
}
