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
    1001: pages[1001],
    10158: pages[10158],
    20001: pages[20001],
    20003: pages[20003],
    20004: pages[20004],
    20005: pages[20005],
    20006: pages[20006],
    20101: pages[20101],
    20103: pages[20103],
    20105: pages[20105],
    20106: pages[20106],
    20107: pages[20107],
    20104: pages[20104],
    20110: pages[20110],
    20111: pages[20111],
    20201: pages[20201],
    20203: pages[20203],
    20207: pages[20207],
    20299: pages[20299],
    20402: pages[20402],
    20403: pages[20403],
    20404: pages[20404]
  };
}

export function translate(id, translations, isName = false, isRef = false) {
  if (!id) return null;
  const ids = id.replace(/{/, '').replace(/}/, '').split(',');
  let pageId = ids[0].trim();
  const translationId = ids[1].trim();
  let result = translations[pageId].translations[translationId];
  if (result && isName && result.match(/\((.*)\)/)) result = result.match(/\((.*)\)/).pop();
  if (isRef) result = translate(result, translations);
  return result;
}

export function translateRecursive(string, translations) {
  if (!string) return null;
  const regex = /{(.*?)}/g;
  const match = [...string.matchAll(regex)];

  let translation = string;

  if (match.length === 0) return translation;

  match.forEach(match => {
    const group = match[1].split(',');
    const pageId = group[0];
    const translationId = group[1];
    if (!translations[pageId]) throw new Error(`${pageId} not defined in 'getTranslations'`);
    translation = translation.replace(match[0], translations[pageId].translations[translationId]);
  });

  return translateRecursive(translation, translations);
}

export function translateRecursiveTrim(string, translations) {
  return translateRecursive(string, translations).replace(/\((.*?)\)/g, '');
}
