import passport from 'passport';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import googleAuth from 'passport-google-oauth';

import * as logger from '../helpers/logger';
import {models} from '../models/index';

const googleStrategy = googleAuth.OAuth2Strategy;

function setupPassport() {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new googleStrategy({
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL
    }, function (accessToken, refreshToken, profile, done) {
      process.nextTick(() => {
        models.Users.login(profile)
          .then((userRecord) => {
            if (!userRecord.err) {
              return done(null, userRecord);
            } else {
              logger.error('Registration - something went wrong');
              return done(userRecord.err, null);
            }
          });
      });
    }
  ));
}

/*
   This is loaded as middleware to run all the time. This also holds couple of
   exceptions for sites we don't actually want to do it. Consider moving this
   to database row or env variable to have it easily changeable:
   
   'root' route  - should be able to access route to get homepage served
   'dist' folder - should be able to access css / js and assets
   'auth' routes - should be able to access route to be able to login
*/
function ensureAuthenticated(req, res, next) {
  const allowedGuestRoutes = [
    '/auth/',
    '/api/'
  ];
  if (req.isAuthenticated()) {
    return next();
  } else {
    /* Don't just reject, check if this route is public */
    let publicRoute = false;
    if (req.url === '/') {
      publicRoute = true;
      return next();
    }
    allowedGuestRoutes.forEach(guestRoute => {
      if (req.url.indexOf(guestRoute) === 0) {
        publicRoute = true;
        return next();
      }
    });
    if (!publicRoute) {
      logger.error(req, 'Not allowed to access route');
      res.redirect('/');
    }
  }
}

export default function (app) {
  const pgSession       = connectPgSimple(expressSession),
        cookieAge       = 7 * 24 * 60 * 60 * 1000,
        sessionSettings = {
          store:             new pgSession({
            conString: process.env.DATABASE_URL,
            tableName: 'Sessions'
          }),
          secret:            process.env.DATABASE_SECRET,
          resave:            false,
          saveUninitialized: false,
          cookie:            {
            maxAge: cookieAge
          }
        };

  app.use(expressSession(sessionSettings));
  setupPassport();
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(ensureAuthenticated);

  app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}), (req, res) => {
    // this is being handled by google guys, they are smarter
  });

  app.use('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.locals.user = req.user;
    if (req.cookies.loggedIn === undefined) {
      res.cookie('loggedIn', true, {
        maxAge: cookieAge
      });
    }
    res.redirect('/');
  });

  // on each request, save user data in res.local so we can use it on views
  app.use((req, res, next) => {
    if (!req.user) {
      req.user = {};
    }
    res.locals.user = req.user;
    next();
  });

  app.get('/logout', (req, res) => {
    if (req.user) {
      logger.action(req.user.name + ' logged out', 'gray');
    }
    req.logout();
    res.cookie('loggedIn', '', {expires: new Date(0)});
    res.redirect('/');
  });
};
