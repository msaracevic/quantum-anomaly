export default function (sequelize) {
  return sequelize.define('EsiUniverseGroups', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
