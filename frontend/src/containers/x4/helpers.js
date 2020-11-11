export const maps = {
  race: [
    {label: 'Argon', value: 'arg'},
    {label: 'Kha\'ak', value: 'kha'},
    {label: 'Paranid', value: 'par'},
    {label: 'Split', value: 'spl'},
    {label: 'Teladi', value: 'tel'},
    {label: 'Xenon', value: 'xen'}
  ],
  size: {
    ship_xl: 'extralarge',
    ship_l: 'large',
    ship_m: 'medium',
    ship_s: 'small'
  },
  subtype: [
    {label: 'Base variation', value: 'BV'},
    {label: 'Vanguard', value: 'VA'},
    {label: 'Sentinel', value: 'ST'},
    {label: 'Raider', value: 'RD'}
  ],
  reverseRace: {
    arg: 'Argon',
    kha: 'Kha\'ak',
    par: 'Paranid',
    spl: 'Split',
    tel: 'Teladi',
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
    split: 'Zyarth Patriarcy'
  }
};

export const separateWord = arg => arg
  .replace('large', 'large ')
  .replace('heavy', 'heavy ')
  .replace('energy', 'energy ')
  .replace('hullparts', 'hull parts');

export const translateRace = arg => arg
  .replace('arg', 'Argon ')
  .replace('kha', 'Kha\'ak ')
  .replace('par', 'Paranid')
  .replace('spl', 'Split')
  .replace('tel', 'Teladi')
  .replace('xen', 'Xenon');


export const int = arg => arg ? parseInt(arg, 10).toLocaleString('de-DE', {style: 'decimal'}) : 0;
export const float = arg => arg ? parseFloat(arg, 10).toLocaleString('de-DE', {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
}) : 0;
