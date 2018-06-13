export default function (arg) {
  let translations = {
    "SORTIE_MODIFIER_LOW_ENERGY":"Energy Reduction",
    "SORTIE_MODIFIER_IMPACT": "Enemy Physical Enhancement: Impact",
    "SORTIE_MODIFIER_SLASH": "Enemy Physical Enhancement: Slash",
    "SORTIE_MODIFIER_PUNCTURE": "Enemy Physical Enhancement: Puncture",
    "SORTIE_MODIFIER_EXIMUS": "Eximus Stronghold",
    "SORTIE_MODIFIER_MAGNETIC": "Enemy Elemental Enhancement: Magnetic",
    "SORTIE_MODIFIER_CORROSIVE": "Enemy Elemental Enhancement: Corrosive",
    "SORTIE_MODIFIER_VIRAL": "Enemy Elemental Enhancement: Viral",
    "SORTIE_MODIFIER_ELECTRICITY": "Enemy Elemental Enhancement: Electricity",
    "SORTIE_MODIFIER_RADIATION": "Enemy Elemental Enhancement: Radiation",
    "SORTIE_MODIFIER_GAS": "Enemy Elemental Enhancement: Gas",
    "SORTIE_MODIFIER_FIRE": "Enemy Elemental Enhancement: Heat",
    "SORTIE_MODIFIER_EXPLOSION": "Enemy Elemental Enhancement: Blast",
    "SORTIE_MODIFIER_FREEZE": "Enemy Elemental Enhancement: Cold",
    "SORTIE_MODIFIER_TOXIN": "Enemy Elemental Enhancement: Toxin",
    "SORTIE_MODIFIER_POISON": "Enemy Elemental Enhancement: Toxin",
    "SORTIE_MODIFIER_HAZARD_RADIATION" : "Environmental Hazard: Radiation Pockets",
    "SORTIE_MODIFIER_HAZARD_MAGNETIC" : "Environmental Hazard: Electromagnetic Anomalies",
    "SORTIE_MODIFIER_HAZARD_FOG" : "Environmental Hazard: Dense Fog",
    "SORTIE_MODIFIER_HAZARD_FIRE": "Environmental Hazard: Fire",
    "SORTIE_MODIFIER_HAZARD_ICE": "Environmental Effect: Cryogenic Leakage",
    "SORTIE_MODIFIER_HAZARD_COLD": "Environmental Effect: Extreme Cold",
    "SORTIE_MODIFIER_ARMOR": "Augmented Enemy Armor",
    "SORTIE_MODIFIER_SHIELDS": "Enhanced Enemy Shields",
    "SORTIE_MODIFIER_SECONDARY_ONLY": "Weapon Restriction: Pistol Only",
    "SORTIE_MODIFIER_SHOTGUN_ONLY": "Weapon Restriction: Shotgun Only",
    "SORTIE_MODIFIER_SNIPER_ONLY": "Weapon Restriction: Sniper Only",
    "SORTIE_MODIFIER_RIFLE_ONLY": "Weapon Restriction: Assault Rifle Only",
    "SORTIE_MODIFIER_MELEE_ONLY": "Weapon Restriction: Melee Only",
    "SORTIE_MODIFIER_BOW_ONLY": "Weapon Restriction: Bow Only",
  };

  let result = translations[arg];
  if (!result) result = translations[arg.toLowerCase()];
  if (!result) result = arg;

  result.replace(/\b\w/g, l => l.toUpperCase());

  return result;
}
