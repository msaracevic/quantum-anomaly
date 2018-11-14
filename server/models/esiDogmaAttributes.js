export default function (sequelize) {
  return sequelize.define('EsiDogmaAttributes', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
