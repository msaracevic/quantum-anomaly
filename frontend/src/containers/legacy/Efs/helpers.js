export function getHumanLabel(stat) {
  let human = {
    shieldCapacity:      {
      label:  'Shield',
      units:  'pts.',
      format: true
    },
    armorHP:             {
      label:  'Armor',
      units:  'pts.',
      format: true
    },
    hp:                  {
      label:  'Hull',
      units:  'pts.',
      format: true
    },
    cpuOutput:           {
      label:  'CPU',
      units:  'tf',
      format: true
    },
    powerOutput:         {
      label:  'PG',
      units:  'MW',
      format: true
    },
    capacitorCapacity:   {
      label:  'Capacitor',
      units:  'GJ',
      format: true
    },
    metaLevel:           {
      label: 'Tech',
      units: null
    },
    upgradeSlotsLeft:    {
      label: 'Rigs',
      units: null
    },
    hiSlots:             {
      label: 'High',
      units: 'slots'
    },
    medSlots:            {
      label: 'Mid',
      units: 'slots'
    },
    lowSlots:            {
      label: 'Low',
      units: 'slots'
    },
    upgradeCapacity:     {
      label: 'Calibration',
      units: null
    },
    turretSlotsLeft:     {
      label: 'Turrets',
      units: 'slots'
    },
    launcherSlotsLeft:   {
      label: 'Launchers',
      units: 'slots'
    },
    align:               {
      label: 'Align',
      units: 's'
    },
    maxVelocity:         {
      label:  'Speed',
      units:  'm/s',
      format: true
    },
    droneBandwidth:      {
      label: 'Drone Bandwidth',
      units: 'Mbit/sec'
    },
    droneCapacity:       {
      label: 'Drone Capacity',
      units: 'm3'
    },
    capacity:            {
      label:  'Cargo',
      units:  'm3',
      format: true
    },
    maxTargetRange:      {
      label:  'Range',
      units:  'Km',
      format: true
    },
    maxLockedTargets:    {
      label: 'Max Locks',
      units: 'targets'
    },
    scanResolution:      {
      label:  'Scan Res.',
      units:  'mm',
      format: true
    },
    warpSpeedMultiplier: {
      label: 'Warp',
      units: 'AU/s'
    },
    agility:             {
      label: 'Agility',
      units: 'x'
    },
    sensorStrength:      {
      label: 'Strength',
      units: ''
    },
    mass:                {
      label:  'Mass',
      units:  't',
      format: true
    }
  };

  return human[stat];
}

export function getOperationSign(unit, trait) {
  let getOperationSign = {
    9:   'm3',
    105: '%',
    139: '+'
  };

  if (!getOperationSign[unit] && unit) {
    // console.log(trait);
  }

  return getOperationSign[unit];
}

export function getRigSizeLabel(size) {
  if (!size) size = '';
  else if (size === 1) size = ' small';
  else if (size === 2) size = ' medium';
  else if (size === 3) size = ' large';
  else if (size === 4) size = ' x-large';
  return size;
}

export function getStatObject(value, stat) {
  let humanValues = getHumanLabel(stat);

  humanValues.value = value || 0;

  if (stat === 'upgradeSlotsLeft') {
    humanValues.value += getRigSizeLabel(value);
  } else if (stat === 'align') {
    humanValues.value = Math.LN2 * value / 500000;
    humanValues.value = Math.round(humanValues.value * 100) / 100;
  } else if (stat === 'agility') {
    humanValues.value = Math.round(value * 100) / 100;
  } else if (stat === 'maxTargetRange') {
    humanValues.value = value / 1000;
  } else if (stat === 'mass') {
    humanValues.value = value / 1000;
  } else if (stat === 'sensorStrength') {
    humanValues.label = value.label;
    humanValues.units = '';
    humanValues.value = value.value;
  }

  if (humanValues.units === 'slots' && humanValues.value === 1) humanValues.units = 'slot';
  if (humanValues.format) humanValues.value = humanValues.value.toLocaleString();

  return {
    label: humanValues.label,
    value: humanValues.value,
    units: humanValues.units
  }
}
