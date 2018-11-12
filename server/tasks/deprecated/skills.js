import Sequelize from 'sequelize';

import * as logger from '../../helpers/logger';

const TYPE_SELECT = {type: Sequelize.QueryTypes.SELECT};

function addPropertiesToSkills(skills, sequelize) {
  const query = 'SELECT * FROM "dgmTypeAttributes" ' +
    'INNER JOIN "dgmAttributeTypes" ' +
    'ON "dgmTypeAttributes"."attributeID" = "dgmAttributeTypes"."attributeID"';

  return Promise.all(skills.map(skill =>
    sequelize.query(query + ' WHERE "typeID"=' + skill.typeID, {type: sequelize.QueryTypes.SELECT})
      .then(attributes => {
        attributes.forEach(attribute => {
          if (attribute.published) {
            skill[attribute.attributeName] = attribute.valueFloat;
            if (!skill[attribute.attributeName]) {
              skill[attribute.attributeName] = attribute.valueInt;
            }
          }
        });
      })
  )).then(() => logger.action('Added properties to each skill'));
}

function getSkills(sequelize) {
  const query = 'SELECT "typeID", "typeName", "description", "invTypes"."groupID", "groupName" ' +
    'FROM "invTypes" ' +
    'JOIN "invGroups" ON "invTypes"."groupID" = "invGroups"."groupID" ' +
    'JOIN "invCategories" ON "invGroups"."categoryID" = "invCategories"."categoryID" ' +
    'WHERE "invCategories"."categoryID"=16 AND "invTypes"."published"=true;';

  return sequelize.query(query, TYPE_SELECT).then(skills => {
    logger.action(`Grabbed data for ${skills.length} skills`);
    return skills;
  });
}

export default function (eveSequelize, sequelize) {
  let skills;

  const Skills = sequelize.define('Skills', {
    typeID: Sequelize.INTEGER,
    value:  Sequelize.JSON
  });

  return getSkills(eveSequelize)
    .then(skillsData => skills = skillsData)
    .then(() => addPropertiesToSkills(skills, eveSequelize))
    .then(() => Skills.sync({force: true}))
    .then(() => {
      logger.action('Skills model synced', [], 'green');
      return Promise.all(skills.map(skill =>
        Skills.create({
          typeID: skill.typeID,
          value:  skill
        })
      ));
    })
    .then(() => {
      logger.action(`Skills model saved, ${skills.length} rows added`, [], 'green');
      return skills.length;
    });
};
