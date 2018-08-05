import * as logger from '../helpers/logger';

const ALLOW_ORIGIN = '*';

function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}

export default function (app) {
  app.use(cors);
  logger.appLog(`CORS module activated, allowed origin: ${ALLOW_ORIGIN}`);
}
