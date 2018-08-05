export default function (sequelize) {
  return sequelize.define('EveMarketGroups', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
