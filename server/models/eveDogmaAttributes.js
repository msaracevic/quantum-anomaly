export default function (sequelize) {
  return sequelize.define('EveDogmaAttributes', {
    id:   {
      type:       sequelize.Sequelize.INTEGER,
      primaryKey: true
    },
    data: sequelize.Sequelize.JSON,
  });
};
