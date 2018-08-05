import * as logger from '../helpers/logger';

export default function (sequelize) {
  let Users = sequelize.define('Users', {
    name:      sequelize.Sequelize.STRING,
    userGroup: sequelize.Sequelize.JSON,
    email:     sequelize.Sequelize.STRING
  });
  
  Users.findByEmail = findByEmail.bind(Users);
  Users.login       = login.bind(Users);
  return Users;
}

function findByEmail(email) {
  return this.findOne({
    where: {
      email: email
    }
  });
}

function login(user) {
  if (!user.emails.length) {
    logger.error('Unauthorized login attempt - no email provided');
    return {err: 'unauthorized'};
  }

  user.emails.forEach((email) => {
    if (email.type === 'account') {
      user.email = email.value;
    }
  });
  
  return this.findByEmail(user.email)
    .then((userRecord) => {
      if (userRecord) {
        logger.action(userRecord.email + ' logged in (group: ' + userRecord.userGroup + ')');
        return userRecord;
      } else {
        if (process.env.REGISTRATION === 'true') {
          logger.action('Registering new user ' + user.email);
          return this.create({
            name:      user.email.split('@')[0],
            userGroup: ['guest'],
            email:     user.email
          });
        } else {
          logger.error('Unauthorized login attempt - registrations are disabled');
          return {err: 'unauthorized'};
        }
      }
    });
}
