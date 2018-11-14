export default function (sequelize) {
  return sequelize.define('EsiUniverseCategories', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
