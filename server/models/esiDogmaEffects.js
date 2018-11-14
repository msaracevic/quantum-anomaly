export default function (sequelize) {
  return sequelize.define('EsiDogmaEffects', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
