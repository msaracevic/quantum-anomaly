import xml2js from 'xml2js';
import path from 'path';
import {promises as fs} from 'fs';

export async function getTranslations(resourcesPath) {
  const pathToFile = path.join(resourcesPath, 't', '0001-l044.xml');

  const parser = new xml2js.Parser({mergeAttrs: true, explicitArray: true});
  const parsed = await parser.parseStringPromise(await fs.readFile(pathToFile));
  const pages = {};

  parsed.language.page.forEach(page => {
    const translations = {};
    page.t.forEach(translation => translations[translation.id] = translation['_']);
    pages[page.id] = {title: page.title[0], translations: translations};
  });

  return {
    20003: pages[20003],
    20004: pages[20004],
    20006: pages[20006],
    20101: pages[20101],
    20105: pages[20105],
    20106: pages[20106],
    20107: pages[20107],
    20104: pages[20104],
    20111: pages[20111]
  };
}

export function translate(id, translations, isName = false, isRef = false) {
  if (!id) return null;
  const ids = id.replace(/{/, '').replace(/}/, '').split(',');
  const pageId = ids[0].trim();
  const translationId = ids[1].trim();
  let result = translations[pageId].translations[translationId];
  if (result && isName && result.match(/\((.*)\)/)) result = result.match(/\((.*)\)/).pop();
  if (isRef) result = translate(result, translations);
  return result;
}
