export default function (sequelize) {
  return sequelize.define('EveCache', {
    id:   {
      type:          sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:    true
    },
    name: sequelize.Sequelize.STRING(255),
    data: sequelize.Sequelize.JSON
  });
};
