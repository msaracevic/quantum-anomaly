export const maps = {
  race: [
    {label: 'Argon', value: 'arg'},
    {label: 'ATF', value: 'atf'},
    {label: 'Kha\'ak', value: 'kha'},
    {label: 'Paranid', value: 'par'},
    {label: 'Split', value: 'spl'},
    {label: 'Teladi', value: 'tel'},
    {label: 'Terran', value: 'ter'},
    {label: 'Yaki', value: 'yak'},
    {label: 'Xenon', value: 'xen'}
  ],
  size: {
    ship_xl: 'extralarge',
    ship_l: 'large',
    ship_m: 'medium',
    ship_s: 'small'
  },
  variations: [
    {label: 'Base variation', value: 'BV'},
    {label: 'Vanguard', value: 'VA'},
    {label: 'Sentinel', value: 'ST'},
    {label: 'Raider', value: 'RD'}
  ],
  reverseRace: {
    atf: 'ATF',
    arg: 'Argon',
    kha: 'Kha\'ak',
    par: 'Paranid',
    spl: 'Split',
    tel: 'Teladi',
    ter: 'Terran',
    yak: 'Yaki',
    xen: 'Xenon'
  },
  factions: {
    argon: 'Argon Federation',
    antigone: 'Antigone Republic',
    alliance: 'Alliance of the Word',
    holyorder: 'Holy Order',
    paranid: 'Paranid Godrealm',
    freesplit: 'Free Families',
    teladi: 'Teladi Company',
    ministry: 'Ministry of Finance',
    xenon: 'Xenon',
    scaleplate: 'Scale Plate Pact',
    split: 'Zyarth Patriarcy',
    pioneers: 'Segaris Pioneers',
    yaki: 'Yaki',
    terran: 'Terran Protectorate'

  },
  colors: {
    xenon: {color: '#880000', border: '#c90000'},
    paranid: {color: '#2d0050', border: '#8000ff'},
    alliance: {color: '#b03cca', border: '#b03cca'},
    split: {color: '#5e2204', border: '#ff691e'},
    argon: {color: '#00256e', border: '#0055ff'},
    antigone: {color: '#4023ae', border: '#5033de'},
    hatikvah: {color: '#147a70', border: '#20f6e1'},
    teladi: {color: '#6e7c2a', border: '#a9c22e'},
    ministry: {color: '#94bc92', border: '#94bc92'},
    holyorder: {color: '#b45694', border: '#ff72ad'},
    freesplit: {color: '#a45525', border: '#ff8000'},
    pioneers: {color: '#41aa9a', border: '#66aa9a'},
    yaki: {color: '#fe8dfa', border: '#ffadfa'},
    terran: {color: '#bcd0fb', border: '#bcd0fb'},
    none: {color: '#666', border: '#aaa'}
  },
  resourceColors: {
    ore: '#ff8c00',
    silicon: '#d4d3cf',
    nividium: '#Ab20B1',
    ice: '#ffffff',
    hydrogen: '#c5ffff',
    helium: '#ffeec1',
    methane: '#367ca2'
  }
};

const HEXSIZE = {x: 24.8, y: 42.5};
const HEXSIZE_SMALL = {x: 12.2, y: 21.1};
const HEX_OFFSET = {x: 12.5, y: 21.5};

export const separateWord = arg => arg
  .replace('large', 'large ')
  .replace('heavy', 'heavy ')
  .replace('energy', 'energy ')
  .replace('computronic', 'computronic ')
  .replace('metallic', 'metallic ')
  .replace('hullparts', 'hull parts');

export const translateRace = arg => maps.reverseRace[arg];
export const getSizeLabel = arg => separateWord(maps.size[arg]);

export const int = arg => arg ? parseInt(arg, 10).toLocaleString('de-DE', {style: 'decimal'}) : 0;
export const float = arg => arg ? parseFloat(arg, 10).toLocaleString('de-DE', {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
}) : 0;


export const getHexagonPoints = (prop, type) => {
  const {x, y} = prop;
  const {x: hx, y: hy} = type === 'small' ? HEXSIZE_SMALL : HEXSIZE;
  return `${x - hx},${y - hy} ${x + hx},${y - hy} ${x + hx * 2},${y} ${x + hx},${y + hy} ${x - hx},${y + hy} ${x - hx * 2},${y} ${x - hx},${y - hy}`;
};

export const resolveHexagonCenterByProps = (sectorPosition, sectorIndex, cluster) => {
  switch (sectorPosition) {
    case 'top-right':
      if (sectorIndex === 0) return {x: cluster.x + HEX_OFFSET.x, y: cluster.y - HEX_OFFSET.y};
      else return {x: cluster.x - HEX_OFFSET.x, y: cluster.y + HEX_OFFSET.y};
    case 'top-left':
      if (sectorIndex === 0) return {x: cluster.x - HEX_OFFSET.x, y: cluster.y - HEX_OFFSET.y};
      else return {x: cluster.x + HEX_OFFSET.x, y: cluster.y + HEX_OFFSET.y};
    case 'tripple-right':
      if (sectorIndex === 0) return {x: cluster.x + HEX_OFFSET.x, y: cluster.y + HEX_OFFSET.y};
      else if (sectorIndex === 1) return {x: cluster.x - HEX_OFFSET.x * 2, y: cluster.y};
      else return {x: cluster.x + HEX_OFFSET.x, y: cluster.y - HEX_OFFSET.y};
    case 'singular':
      return {x: cluster.x, y: cluster.y};
  }
};

export const backgroundLabelRectWidth = label => {
  let numberOfShortLetters = 0;
  const i = label.toLowerCase().match(/i/g);
  const l = label.toLowerCase().match(/l/g);
  const apo = label.toLowerCase().match(/'/g);
  const m = label.toLowerCase().match(/M/g);
  const bigZ = label.match(/Z/g);
  const bigA = label.match(/A/g);

  if (i) numberOfShortLetters += i.length;
  if (l) numberOfShortLetters += l.length;
  if (apo) numberOfShortLetters += apo.length * 2;
  if (bigZ) numberOfShortLetters -= bigZ.length;
  if (bigA) numberOfShortLetters -= bigA.length * 2;
  if (m) numberOfShortLetters -= m.length * 2;

  return numberOfShortLetters;
};

export const getHexagonPointsV2 = (props, divider = 1) => {
  const {x, y} = props;
  const hx = 62 / divider;
  const hy = 108 / divider;
  return `${x - hx},${y - hy} ${x + hx},${y - hy} ${x + hx * 2},${y} ${x + hx},${y + hy} ${x - hx},${y + hy} ${x - hx * 2},${y} ${x - hx},${y - hy}`;
};
