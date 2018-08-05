export default function (sequelize) {
  return sequelize.define('EveShips', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    name: sequelize.Sequelize.STRING(255),
    data: sequelize.Sequelize.JSON
  });
};
