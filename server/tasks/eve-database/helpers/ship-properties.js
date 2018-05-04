function convertToPercent(value) {
  return Math.round((1 - value) * 1000) / 10;
}

export default function (ships) {
  return ships.map(ship => {
    // Delete unused attributes
    delete ship.anchorable;
    delete ship.anchored;
    delete ship.categoryID;
    delete ship.categoryName;
    delete ship.description;
    delete ship.fittableNonSingleton;
    delete ship.graphicID;
    delete ship.groupID;
    delete ship.iconID;
    delete ship.marketGroupID;
    delete ship.portionSize;
    delete ship.published;
    delete ship.shortDescription;
    delete ship.soundID;
    delete ship.useBasePrice;

    // As of version EVE version 119.5 ships without Race ID are Concord ships
    // Afterwards delete raceID since we don't need it
    if (ship.raceID === null) {
      ship.raceName = 'Concord';
    }
    delete ship.raceID;

    // Let's compress this into one object for easier access and lets unify the attribute naming
    // Afterwards delete original attributes
    ship.shieldProfile = {
      em:        convertToPercent(ship.shieldEmDamageResonance),
      thermal:   convertToPercent(ship.shieldThermalDamageResonance),
      kinetic:   convertToPercent(ship.shieldKineticDamageResonance),
      explosive: convertToPercent(ship.shieldExplosiveDamageResonance)
    };

    ship.armorProfile = {
      em:        convertToPercent(ship.armorEmDamageResonance),
      thermal:   convertToPercent(ship.armorThermalDamageResonance),
      kinetic:   convertToPercent(ship.armorKineticDamageResonance),
      explosive: convertToPercent(ship.armorExplosiveDamageResonance)
    };

    ship.hullProfile = {
      em:        convertToPercent(ship.emDamageResonance),
      thermal:   convertToPercent(ship.thermalDamageResonance),
      kinetic:   convertToPercent(ship.kineticDamageResonance),
      explosive: convertToPercent(ship.explosiveDamageResonance)
    };

    delete ship.shieldEmDamageResonance;
    delete ship.shieldThermalDamageResonance;
    delete ship.shieldKineticDamageResonance;
    delete ship.shieldExplosiveDamageResonance;

    delete ship.armorEmDamageResonance;
    delete ship.armorThermalDamageResonance;
    delete ship.armorKineticDamageResonance;
    delete ship.armorExplosiveDamageResonance;

    delete ship.emDamageResonance;
    delete ship.thermalDamageResonance;
    delete ship.kineticDamageResonance;
    delete ship.explosiveDamageResonance;

    // Figure out meta level's and mark special ships (rare limited edition ships)
    if (ship.metaLevel === 9) ship.special = true;
    if (ship.metaLevel === 5) ship.metaLevel = 'Tech II';
    else if (ship.metaLevel > 5) ship.metaLevel = 'Faction';
    else ship.metaLevel = 'Tech I';
    
    // Preset some of the values
    if (!ship.traits) ship.traits = {};
    ship.align = ship.agility * ship.mass;
    ship.cpuOutput = ship.cpuOutput || 0;
    ship.powerOutput = ship.powerOutput || 0;
    
    // Let's compress this into one object for easier access and lets unify the attribute naming
    // Afterwards delete original attributes
    ship.sensorStrength = {};
    if (ship['scanGravimetricStrength'] > 0) {
      ship.sensorStrength.value = ship['scanGravimetricStrength'];
      ship.sensorStrength.label = 'Gravimetric';
    }
    else if (ship['scanLadarStrength'] > 0) {
      ship.sensorStrength.value = ship['scanLadarStrength'];
      ship.sensorStrength.label = 'Ladar';
    }
    else if (ship['scanMagnetometricStrength'] > 0) {
      ship.sensorStrength.value = ship['scanMagnetometricStrength'];
      ship.sensorStrength.label = 'Magnetometric';
    }
    else if (ship['scanRadarStrength'] > 0) {
      ship.sensorStrength.value = ship['scanRadarStrength'];
      ship.sensorStrength.label = 'Radar';
    }

    delete ship.scanGravimetricStrength;
    delete ship.scanLadarStrength;
    delete ship.scanMagnetometricStrength;
    delete ship.scanRadarStrength;

    // For future, let's delete base market price and add attribute for price updates
    delete ship.basePrice;
    ship.price = 0;
  });
}
