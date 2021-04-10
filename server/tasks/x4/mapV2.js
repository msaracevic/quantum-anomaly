import path from 'path';
import xml2js from 'xml2js';
import {promises as fs} from 'fs';
import {translateRecursiveTrim} from './translations';
import {saveToFile} from './helpers';

// layers ==> galaxy -> cluster -> sector -> zone -> stuff ??

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
    if (galaxyItem.ref === 'clusters' && galaxyItem.macro.connection === 'galaxy' && !galaxyItem.offset)
      galaxyItem.offset = {position: {x: 0, y: 0, z: 0}};
    else if (galaxyItem.ref === 'clusters' && galaxyItem.macro.connection === 'galaxy') {
      galaxyItem.offset.position.x = parseInt(galaxyItem.offset.position.x, 10);
      galaxyItem.offset.position.y = parseInt(galaxyItem.offset.position.y, 10);
      galaxyItem.offset.position.z = parseInt(galaxyItem.offset.position.z, 10);
    }
  });
  return galaxy;
}

function processClusters(clusters) {
  clusters.forEach(clusterItem => clusterItem.connections.connection.forEach(clusterConnection => {
    if (!clusterConnection.offset || !clusterConnection.offset.position)
      clusterConnection.offset = {position: {x: 0, y: 0, z: 0}};
    else {
      clusterConnection.offset.position.x = parseInt(clusterConnection.offset.position.x, 10);
      clusterConnection.offset.position.y = parseInt(clusterConnection.offset.position.y, 10);
      clusterConnection.offset.position.z = parseInt(clusterConnection.offset.position.z, 10);
    }
  }));
  return clusters;
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
    if (region.boundary.size.class === 'box') {
      region.boundary.size.x = parseFloat(region.boundary.size.x);
      region.boundary.size.y = parseFloat(region.boundary.size.y);
      region.boundary.size.z = parseFloat(region.boundary.size.z);
    }
    if (region.boundary.class === 'splinetube') {
      region.boundary.splineposition = region.boundary.splineposition.map(item => {
        item.x = parseFloat(item.x);
        item.y = parseFloat(item.y);
        item.z = parseFloat(item.z);
        item.tx = parseFloat(item.tx);
        item.ty = parseFloat(item.ty);
        item.tz = parseFloat(item.tz);
        item.inlength = parseFloat(item.inlength);
        item.outlength = parseFloat(item.outlength);
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
        const weightedTop = Math.ceil(resourcesInFieldObject[key].resources[ware] / (highestValues[ware] / 2) * 100);
        resourcesInFieldObject[key].relativeResources = {
          ...resourcesInFieldObject[key].relativeResources,
          [ware]: weightedTop > 99 ? 99 : weightedTop,
        };
      }
    });
  });

  return resourcesInFieldObject;
}

export async function getMapV2(sourceBasePath, translations) {
  const baseSourcePath = sourceBasePath;
  const splitSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_split');
  const terranSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_terran');
  let base, split, terran;
  const map = [];

  // ----------------------------------------------------------------------------------- mapDefaults - DONE
  // From mapDefaults we can be sure to pick up each cluster and sector in game
  // This will provide base macro names, name, description, sunlight,
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'mapdefaults.xml'));
  split = await parseFile(path.join(splitSourcePath, 'libraries', 'mapdefaults.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'libraries', 'mapdefaults.xml'));
  const mapDefaults = processMapDefaults([
    ...base.defaults.dataset,
    ...split.defaults.dataset,
    ...terran.defaults.dataset
  ], translations);

  const mapDefaultsObjects = {};
  mapDefaults.forEach(item => mapDefaultsObjects[item.macro] = item.properties);
  // await saveToFile(mapDefaultsObjects, '_map-step-mapDefaults');


  // ----------------------------------------------------------------------------------- galaxy - DONE
  // From galaxy we can find connections of clusters to the galaxy layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'galaxy.xml'));

  const galaxy = processGalaxy([
    ...base.macros.macro.connections.connection,
    ...split.diff.add.connection,
    ...terran.diff.add.connection
  ]);
  // await saveToFile(galaxy, '_map-step-galaxy');

  // ----------------------------------------------------------------------------------- clusters
  // From clusters we can find connections of sectors to the cluster layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'clusters.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_clusters.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_clusters.xml'));
  const clusters = processClusters([
    ...base.macros.macro,
    ...split.macros.macro,
    ...terran.macros.macro
  ]);

  const clusterObjects = {};
  clusters.forEach(item => clusterObjects[item.name] = item.connections.connection);
  // await saveToFile(clusterObjects, '_map-step-clusters');


  // ----------------------------------------------------------------------------------- sectors
  // From sectors we can find connections of zones to the sector layer
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'sectors.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_sectors.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_sectors.xml'));
  const sectors = [
    ...base.macros.macro,
    ...split.macros.macro,
    ...terran.macros.macro
  ];
  // await saveToFile(sectors, '_map-step-sectors');


  // ----------------------------------------------------------------------------------- regionDefinitions
  // From regionDefinitions we can find resource definitions and convert them to object for reference
  base = await parseFile(path.join(baseSourcePath, 'libraries', 'region_definitions.xml'));
  split = await parseFile(path.join(splitSourcePath, 'libraries', 'region_definitions.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'libraries', 'region_definitions.xml'));

  // We also need to feed regionYields to get the yield modifiers
  const regionYields = await parseFile(path.join(baseSourcePath, 'libraries', 'regionyields.xml'));
  const regionYieldsObject = processRegionYields(regionYields);
  // await saveToFile(regionYieldsObject, '_map-step-regionYields');

  // We also need to feed regionObjectGroups to get the actual yield of each asteroid
  const regionObjectGroups = await parseFile(path.join(baseSourcePath, 'libraries', 'regionobjectgroups.xml'));
  const regionObjectGroupsObject = processRegionObjectGroups(regionObjectGroups);
  // await saveToFile(regionObjectGroupsObject, '_map-step-regionObjectGroups');

  const regionDefinitions = processRegions([
    ...base.regions.region,
    ...split.regions.region,
    ...terran.regions.region
  ], regionObjectGroupsObject, regionYieldsObject);
  // await saveToFile(regionDefinitions, '_map-step-regionDefinitions');

  // Once we have all that, we can calculate details for each thing
  const resourcesInFieldObject = processResourcesInField(regionDefinitions);
  await saveToFile(resourcesInFieldObject, '_map-step-resourcesInField');


  // ----------------------------------------------------------------------------------- zones
  base = await parseFile(path.join(baseSourcePath, 'maps', 'xu_ep2_universe', 'zones.xml'));
  split = await parseFile(path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_zones.xml'));
  terran = await parseFile(path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_zones.xml'));
  const zones = [
    ...base.macros.macro,
    ...split.macros.macro,
    ...terran.macros.macro
  ];
  // await saveToFile(zones, '_map-step-zones');


  // from each galaxyItem we can pick up connection which describes where cluster is connected to galaxy
  galaxy.forEach(galaxyItem => {
    if (galaxyItem.ref === 'clusters') {
      const cluster = {
        id: galaxyItem.macro.ref,
        ...mapDefaultsObjects[galaxyItem.macro.ref],
        ...galaxyItem.offset
      };
      cluster.sectors = [];
      cluster.sechighways = [];
      cluster.regions = [];

      clusterObjects[galaxyItem.macro.ref].forEach(clusterObjectsItem => {
        if (clusterObjectsItem.ref === 'sectors') cluster.sectors.push({
          id: clusterObjectsItem.macro.ref,
          ...mapDefaultsObjects[clusterObjectsItem.macro.ref],
          ...clusterObjectsItem.offset
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

            cluster.regions.push({
              id: clusterObjectsItem.macro.name,
              ...clusterObjectsItem.offset,
              ...clusterObjectsItem.macro.properties.region
            });
          }
        }
      });

      map.push(cluster);
    }
  });

  return {
    clusters: map,
    helpers: {}
  };
}
