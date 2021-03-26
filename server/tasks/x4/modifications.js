import xml2js from 'xml2js';
import path from 'path';
import {promises as fs} from 'fs';
import {translateRecursive} from './translations';

export async function getModifications(sourceBasePath, wares, translations) {
  const parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});
  const pathToFile = path.join(sourceBasePath, 'libraries', 'equipmentmods.xml');
  const parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));

  Object.keys(parsed.equipmentmods).forEach(subsystemKey =>
    // sbsKey -> weapons, engines, ship, shields
    Object.keys(parsed.equipmentmods[subsystemKey]).forEach(typeKey => {
      // typeKey -> damage, mass, drag...
      let types = parsed.equipmentmods[subsystemKey][typeKey];
      if (!Array.isArray(types)) types = [parsed.equipmentmods[subsystemKey][typeKey]];
      parsed.equipmentmods[subsystemKey][typeKey] = types.map(mod => processModifications(mod, wares, translations));
    })
  );

  return parsed;
}

export function processModifications(mod, wares, translations) {
  // thank god for BigO being linerar for direct access, eh... and be wary in this code...
  const ware = wares.wares.ware[mod.ware];

  mod.name = translateRecursive(ware.shortname, translations);
  mod.description = translateRecursive(ware.name, translations).replace(/\\/g, '')
    .replace(')', '')
    .replace('(', '')
    .replace(translateRecursive(ware.shortname, translations), '')
    .trim();

  if (mod.ware === 'mod_weapon_surfaceelement_01_mk1') {
    mod.name = 'Intruder';
    mod.description = 'Surface Element Damage Mod - Basic Quality';
  } else if (mod.ware === 'mod_weapon_surfaceelement_01_mk2') {
    mod.name = 'Infiltrator';
    mod.description = 'Surface Element Damage Mod - Enhanced Quality';
  } else if (mod.ware === 'mod_weapon_surfaceelement_01_mk3') {
    mod.name = 'Invader';
    mod.description = 'Surface Element Damage Mod - Exceptional Quality';
  }

  mod.production = ware.production.primary.ware.map(item => {
    const label = wares.wares.ware[item.ware].name;
    return {
      ware: translateRecursive(label, translations),
      amount: item.amount
    };
  });

  return mod;
}
