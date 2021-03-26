import path from 'path';
import xml2js from 'xml2js';
import {promises as fs} from 'fs';
import {translate, translateRecursive} from './translations';

// it's 3 am, this thing is so messed up and all over the place in source... deal with it... and pray it doesn't break
// if it did break, just give up and do something else with your life...
export async function getMap(sourceBasePath, translations) {
  let splitSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_split');
  let terranSourcePath = path.join(sourceBasePath, 'extensions', 'ego_dlc_terran');
  let parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});

  // from here we get list of all sectors with their name and descriptions, they can be then grouped by macro which
  // points to cluster
  let pathToFile = path.join(sourceBasePath, 'libraries', 'mapdefaults.xml');
  let pathToSplitFile = path.join(splitSourcePath, 'libraries', 'mapdefaults.xml');
  let pathToTerranFile = path.join(terranSourcePath, 'libraries', 'mapdefaults.xml');
  let parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  let splitParsed = await parser.parseStringPromise(await fs.readFile(pathToSplitFile));
  let terranParsed = await parser.parseStringPromise(await fs.readFile(pathToTerranFile));
  const mapDefaults = parsed.defaults.dataset = [...parsed.defaults.dataset, ...splitParsed.defaults.dataset, ...terranParsed.defaults.dataset];

  let result = {sectors: {}, zones: {}, resources: {}, stations: {}, regions: {}};

  // read from region definitions
  // go through array result.clusters
  // for each macro.property.region.ref take and look into region definitions, grab if definition of minable items
  pathToFile = path.join(sourceBasePath, 'libraries', 'region_definitions.xml');
  parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(splitSourcePath, 'libraries', 'region_definitions.xml');
  splitParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(terranSourcePath, 'libraries', 'region_definitions.xml');
  terranParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));

  const regions = parsed.regions.region = [...parsed.regions.region, ...splitParsed.regions.region, ...terranParsed.regions.region];
  regions.forEach(region => result.regions[region.name] = {...region});

  // from here we can use cluster macro to find what is inside this cluster, the thing we care for is
  // asteroid fieds, we are going to take all connections and sort them under their macro name for reference later
  pathToFile = path.join(sourceBasePath, 'maps', 'xu_ep2_universe', 'clusters.xml');
  parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_clusters.xml');
  splitParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_clusters.xml');
  terranParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  const clusters = parsed.macros.macro = [...parsed.macros.macro, ...splitParsed.macros.macro, ...terranParsed.macros.macro];

  // problem here is that some regions are shared definitions and appear on multiple connections...
  // since I no longer remember the where those connections are described and how to create them, we will just assume
  // the location based on connection name and manually calculate which cluster / sector it is and add the zones
  // together into one sensible number
  clusters.forEach(cluster => {
    cluster.connections.connection.forEach(connection => {
      if (connection.macro.properties && connection.macro.properties.region.ref.indexOf('audioregion') === -1) {
        const resources = result.regions[connection.macro.properties.region.ref].resources;
        if (resources && resources.resource) {
          let name = connection.name;
          // beacuse old files have different namings then new ones, do some weird shit... For old files we have
          // something like C01S01, for new ones we have Cluster100_Sector001, we want to unify it all
          name = name.replace('Cluster', 'C').replace('_Sector0', 'S').split('_')[0];
          const cluster = name.match(/C(.*)S/)[1];
          const sector = '0' + name.match(/S(.*)/)[1];
          name = `Cluster_${cluster}_Sector${sector}_macro`;
          if (!result.resources[name]) result.resources[name] = [];
          Array.isArray(resources.resource)
            ? result.resources[name] = result.resources[name].concat(resources.resource)
            : result.resources[name].push(resources.resource);
        }
      }
    });
  });

  // resources can be medium, high and veryhigh. Since this is arbitery to show how much it is present per system
  // we can just give 5 points for medium occurance, 10 for high and 20 for veryhigh

  const totalYields = {};
  Object.keys(result.resources).map(key => {
    totalYields[key] = {ore: 0, silicon: 0, nividium: 0, ice: 0, hydrogen: 0, helium: 0, methane: 0};
    result.resources[key].map(res => {
      let values = {lowest: 1, verylow: 2, low: 3, medium: 5, high: 10, veryhigh: 20};
      totalYields[key][res.ware] += values[res.yield];
    });
  });

  // from sectors we get zone ofc! makes total sense, anyways this maps every zone to a given sectors,
  // so we are going to use it for that mapping service
  pathToFile = path.join(sourceBasePath, 'maps', 'xu_ep2_universe', 'sectors.xml');
  parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_sectors.xml');
  splitParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_sectors.xml');
  terranParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  const sectors = parsed.macros.macro = [...parsed.macros.macro, ...splitParsed.macros.macro, ...terranParsed.macros.macro];

  sectors.forEach(sector => {
    result.sectors[sector.name] = [];
    sector.connections.connection.forEach(connection => {
      // the SHCon gates are defined in component.xml under <component name="standardzone" class="zone">
      result.sectors[sector.name].push(connection);
    });
  });

  pathToFile = path.join(sourceBasePath, 'maps', 'xu_ep2_universe', 'zones.xml');
  parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(splitSourcePath, 'maps', 'xu_ep2_universe', 'dlc4_zones.xml');
  splitParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(terranSourcePath, 'maps', 'xu_ep2_universe', 'dlc_terran_zones.xml');
  terranParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  const zones = parsed.macros.macro = [...parsed.macros.macro, ...splitParsed.macros.macro, ...terranParsed.macros.macro];
  zones.forEach(zone => result.zones[zone.name] = {...zone});

  pathToFile = path.join(sourceBasePath, 'libraries', 'god.xml');
  parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(splitSourcePath, 'libraries', 'god.xml');
  splitParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  pathToFile = path.join(terranSourcePath, 'libraries', 'god.xml');
  terranParsed = await parser.parseStringPromise(await fs.readFile(pathToFile));

  const splitDlcStations = splitParsed.diff.add.filter(item => item.sel === '/god/stations');
  const terranDlcStations = terranParsed.diff.add.filter(item => item.sel === '/god/stations');
  const stationsParsed = parsed.god.stations.station = [...parsed.god.stations.station, ...splitDlcStations[0].station, ...terranDlcStations[0].station];

  stationsParsed.forEach(station => {
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
      if (!result.stations[sectorId]) result.stations[sectorId] = [];
      result.stations[sectorId].push({
        id: station.id,
        race: station.race,
        owner: station.owner,
        tags: station.type === 'tradingstation' ? 'tradestation' : station.station.select.tags.replace(/\[/, '').replace(/]/, '')
      });
    }
  });

  mapDefaults.forEach(mapDefault => {
    if (mapDefault.macro === 'xu_ep2_universe_macro') return;
    if (mapDefault.macro.indexOf('demo_') !== -1) return;
    if (mapDefault.macro.indexOf('Sector') === -1) {
      if (!result[mapDefault.macro]) result[mapDefault.macro] = {};
      result[mapDefault.macro] = {
        name:  translate(mapDefault.properties.identification.name, translations, true),
        description: translateRecursive(mapDefault.properties.identification.description, translations),
        area: mapDefault.properties.area,
        sectors: []
      };
    }
    if (mapDefault.macro.indexOf('Sector') !== -1) {
      const parent = mapDefault.macro.replace(/Sector\d\d\d_/, '');
      result[parent].sectors.push({
        name: translate(mapDefault.properties.identification.name, translations, true),
        description: translateRecursive(mapDefault.properties.identification.description, translations),
        id: mapDefault.macro,
        resources: totalYields[mapDefault.macro] || null,
        stations: result.stations[mapDefault.macro] || null
      });
    }
  });

  delete result.resources;
  delete result.zones;
  delete result.sectors;
  delete result.stations;
  delete result.regions;

  const resultArray = Object.keys(result).map(key => result[key]);
  // we pull this manually assigned things
  // grid is 50px wide, we want to be able to go from -12 to 12 columns, so range is 24 * 50 => from 0 to 1200
  // grid is 86px tall, we want to be able to go from -6 to 6 rows, so range is 12 * 86 => from 0 to 1032
  // for every cluster, we choose define central point and then build hex around it, for sectors we either have
  // same sector as cluster, where we just use parents central point and add label or we them split, where we
  // define type of where the each sector is inside the cluster and draw smaller hexagons around it
  // for gates, we define pairs, only one pair is enough, have entry point and exit point, draw gate on both ends,
  // connect with lines. same for highways and super highways

  pathToFile = path.join(__dirname, '..', '..', 'static-files', 'x4-manual-input');

  const mapInfo = JSON.parse(await fs.readFile(path.join(pathToFile, '_sectorsMap.json'), 'utf-8'));
  const gates = JSON.parse(await fs.readFile(path.join(pathToFile, '_gates.json'), 'utf-8')).gates;
  const superHighways = JSON.parse(await fs.readFile(path.join(pathToFile, '_superHighways.json'), 'utf-8')).superHighways;
  const stations = JSON.parse(await fs.readFile(path.join(pathToFile, '_stations.json'), 'utf-8')).stations;

  Object.keys(result).map(key => {
    result[key].position = mapInfo[key].position || {x: -1000, y: -1000};
    result[key].sectorsPosition = mapInfo[key].sectorsPosition || 'singular';
    result[key].owner = mapInfo[key].owner || 'none';
  });

  let temp = {...result['Cluster_29_macro'].sectors[0]};
  result['Cluster_29_macro'].sectors.shift();
  result['Cluster_29_macro'].sectors.push(temp);

  temp = {...result['Cluster_32_macro'].sectors[0]};
  result['Cluster_32_macro'].sectors.shift();
  result['Cluster_32_macro'].sectors.push(temp);

  temp = {...result['Cluster_19_macro'].sectors[0]};
  result['Cluster_19_macro'].sectors.shift();
  result['Cluster_19_macro'].sectors.push(temp);

  temp = {...result['Cluster_21_macro'].sectors[0]};
  result['Cluster_21_macro'].sectors.shift();
  result['Cluster_21_macro'].sectors.push(temp);

  temp = {...result['Cluster_15_macro'].sectors[0]};
  result['Cluster_15_macro'].sectors.shift();
  result['Cluster_15_macro'].sectors.push(temp);

  temp = {...result['Cluster_416_macro'].sectors[0]};
  result['Cluster_416_macro'].sectors.shift();
  result['Cluster_416_macro'].sectors.push(temp);

  temp = {...result['Cluster_408_macro'].sectors[0]};
  result['Cluster_408_macro'].sectors.shift();
  result['Cluster_408_macro'].sectors.push(temp);

  temp = {...result['Cluster_423_macro'].sectors[0]};
  result['Cluster_423_macro'].sectors.shift();
  result['Cluster_423_macro'].sectors.push(temp);

  temp = {...result['Cluster_424_macro'].sectors[0]};
  result['Cluster_424_macro'].sectors.shift();
  result['Cluster_424_macro'].sectors.push(temp);

  const systems = [];
  Object.keys(result).map(key => systems.push(result[key]));

  return {
    systems,
    gates,
    superHighways,
    stations
  };
}
