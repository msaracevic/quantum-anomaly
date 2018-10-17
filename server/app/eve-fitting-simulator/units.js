// well, emberassing, but this info is not available on the EVE online API
// this is copied from database dump

export default function (id) {
  let units = {
    1:   {
      name:        'Length',
      displayName: 'm',
      description: 'Meter'
    },
    2:   {
      name:        'Mass',
      displayName: 'kg',
      description: 'Kilogram'
    },
    3:   {
      name:        'Time',
      displayName: 'sec',
      description: 'Second'
    },
    4:   {
      name:        'Electric Current',
      displayName: 'A',
      description: 'Ampere'
    },
    5:   {
      name:        'Temperature',
      displayName: 'K',
      description: 'Kelvin'
    },
    6:   {
      name:        'Amount Of Substance',
      displayName: 'mol',
      description: 'Mole'
    },
    7:   {
      name:        'Luminous Intensity',
      displayName: 'cd',
      description: 'Candela'
    },
    8:   {
      name:        'Area',
      displayName: 'm2',
      description: 'Square meter'
    },
    9:   {
      name:        'Volume',
      displayName: 'm3',
      description: 'Cubic meter'
    },
    10:  {
      name:        'Speed',
      displayName: 'm/sec',
      description: 'Meter per second'
    },
    11:  {
      name:        'Acceleration',
      displayName: 'm/sec',
      description: 'Meter per second squared'
    },
    12:  {
      name:        'Wave Number',
      displayName: 'm-1',
      description: 'Reciprocal meter'
    },
    13:  {
      name:        'Mass Density',
      displayName: 'kg/m3',
      description: 'Kilogram per cubic meter'
    },
    14:  {
      name:        'Specific Volume',
      displayName: 'm3/kg',
      description: 'Cubic meter per kilogram'
    },
    15:  {
      name:        'Current Density',
      displayName: 'A/m2',
      description: 'Ampere per square meter'
    },
    16:  {
      name:        'Magnetic Field Strength',
      displayName: 'A/m',
      description: 'Ampere per meter'
    },
    17:  {
      name:        'Amount-Of-Substance Concentration',
      displayName: 'mol/m3',
      description: 'Mole per cubic meter'
    },
    18:  {
      name:        'Luminance',
      displayName: 'cd/m2',
      description: 'Candela per square meter'
    },
    19:  {
      name:        'Mass Fraction',
      displayName: 'kg/kg = 1',
      description: 'Kilogram per kilogram, which may be represented by the number 1'
    },
    101: {
      name:        'Milliseconds',
      displayName: 's',
      description: ''
    },
    102: {
      name:        'Millimeters',
      displayName: 'mm',
      description: ''
    },
    103: {
      name:        'MegaPascals',
      displayName: '',
      description: ''
    },
    104: {
      name:        'Multiplier',
      displayName: 'x',
      description: 'Indicates that the unit is a multiplier.'
    },
    105: {
      name:        'Percentage',
      displayName: '%',
      description: ''
    },
    106: {
      name:        'Teraflops',
      displayName: 'tf',
      description: ''
    },
    107: {
      name:        'MegaWatts',
      displayName: 'MW',
      description: ''
    },
    108: {
      name:        'Inverse Absolute Percent',
      displayName: '%',
      description: 'Used for resistance.0.0 = 100% 1.0 = 0%'
    },
    109: {
      name:        'Modifier Percent',
      displayName: '%',
      description: 'Used for multipliers displayed as %1.1 = +10%0.9 = -10%'
    },
    111: {
      name:        'Inversed Modifier Percent',
      displayName: '%',
      description: 'Used to modify damage resistance. Damage resistance bonus.0.1 = 90%0.9 = 10%'
    },
    112: {
      name:        'Radians/Second',
      displayName: 'rad/sec',
      description: 'Rotation speed.'
    },
    113: {
      name:        'Hitpoints',
      displayName: 'HP',
      description: ''
    },
    114: {
      name:        'capacitor units',
      displayName: 'GJ',
      description: 'Giga Joule'
    },
    115: {
      name:        'groupID',
      displayName: 'groupID',
      description: ''
    },
    116: {
      name:        'typeID',
      displayName: 'typeID',
      description: ''
    },
    117: {
      name:        'Sizeclass',
      displayName: '1=small;2=medium;3=large',
      description: ''
    },
    118: {
      name:        'Ore units',
      displayName: 'Ore units',
      description: ''
    },
    119: {
      name:        'attributeID',
      displayName: 'attributeID',
      description: ''
    },
    120: {
      name:        'attributePoints',
      displayName: 'points',
      description: ''
    },
    121: {
      name:        'realPercent',
      displayName: '%',
      description: 'Used for real percentages, i.e. the number 5 is 5%'
    },
    122: {
      name:        'Fitting slots',
      displayName: '',
      description: ''
    },
    123: {
      name:        'trueTime',
      displayName: 'sec',
      description: 'Shows seconds directly'
    },
    124: {
      name:        'Modifier Relative Percent',
      displayName: '%',
      description: 'Used for relative percentages displayed as %'
    },
    125: {
      name:        'Newton',
      displayName: 'N',
      description: ''
    },
    126: {
      name:        'Light Year',
      displayName: 'ly',
      description: ''
    },
    127: {
      name:        'Absolute Percent',
      displayName: '%',
      description: '0.0 = 0% 1.0 = 100%'
    },
    128: {
      name:        'Drone bandwidth',
      displayName: 'Mbit/sec',
      description: 'Mega bits per second'
    },
    129: {
      name:        'Hours',
      displayName: '',
      description: 'Hours'
    },
    133: {
      name:        'Money',
      displayName: 'ISK',
      description: 'ISK'
    },
    134: {
      name:        'Logistical Capacity',
      displayName: 'm3/hour',
      description: 'Bandwidth for PI'
    },
    135: {
      name:        'Astronomical Unit',
      displayName: 'AU',
      description: 'Used to denote distance, 1AU = The distance from the Earth to the Sun.'
    },
    136: {
      name:        'Slot',
      displayName: 'Slot',
      description: 'Slot number prefix for various purposes'
    },
    137: {
      name:        'Boolean',
      displayName: '1=True;0=False',
      description: 'For displaying boolean flags'
    },
    138: {
      name:        'Units',
      displayName: 'units',
      description: 'Units of something, for example fuel'
    },
    139: {
      name:        'Bonus',
      displayName: '+',
      description: 'Forces a plus sign for positive values'
    },
    140: {
      name:        'Level',
      displayName: 'Level',
      description: 'For anything which is divided by levels'
    },
    141: {
      name:        'Hardpoints',
      displayName: 'hardpoints',
      description: 'For various counts to do with turret, launcher and rig hardpoints'
    },
    142: {
      name:        'Sex',
      displayName: '1=Male;2=Unisex;3=Female',
      description: ''
    },
    143: {
      name:        'Datetime',
      displayName: '',
      description: 'Date and time'
    }
  };

  let valueYouAreLookingFor = null;
  if (units[id]) valueYouAreLookingFor = units[id].displayName;
  // Not the One. NOT the One
  if (valueYouAreLookingFor === '') valueYouAreLookingFor = null;
  return valueYouAreLookingFor;
}
