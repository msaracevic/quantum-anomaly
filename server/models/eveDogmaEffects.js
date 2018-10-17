export default function (sequelize) {
  return sequelize.define('EveDogmaEffects', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
