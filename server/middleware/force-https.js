const env = process.env.NODE_ENV || 'development';

import * as logger from '../helpers/logger';

function forceHttps(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https' && env === 'production') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
}


export default function (app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(forceHttps);
    logger.appLog('HTTPS module activated');
  } else {
    logger.appWarning('Non production enviroment, HTTPS redirect disabled');
  }
}
