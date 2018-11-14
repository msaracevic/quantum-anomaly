export default function (sequelize) {
  return sequelize.define('EsiUniverseTypes', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
