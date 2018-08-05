export default function (sequelize) {
  return sequelize.define('EveInvTypes', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
