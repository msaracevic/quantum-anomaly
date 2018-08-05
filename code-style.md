## Code style.

### General information and project structure
Server entry point is in `server/index.js`
All keys, tokens, database credentials should be inside `.env` file. This file should not be commited.

### Javascript code stlye

#### Imports
We are using import statements. Group import statements into two groups which are separated by new line. First group should contain external modules (this will most likely be NPM modules). Second group is our own modules.

*Try to group modules in each group either be functionality or alphabetically - there is no specific rule, but try to apply some pattern. Example lists `express` first because it is parent for `body-parser`, `compression` and `multer` which are then listed alphabetically. `lodash` is at the end because it has nothing to do with express and so it makes no sense to be above `multer`. After new line we are including our own modules.*

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import multer from 'multer';

import myFunction from './myFile';
import * as myFunctions from './myFunctionsFile';
```

#### Exports
If there is just one function to export, wrap it directly into `export default`

Example:
```javascript
export default function () {
  const sequelize = new Sequelize(process.env.DATABASE_URL);
  logger.appLog('Database connection established');
  return modelsCollection.init(sequelize);
};
```

If there is more then one functions, then use the following form
```javascript
export {
  init,
  findByEmail,
  registerUser,
  validatePassword
};
```

#### Paths
When ever dealing with paths (except for imports) always use npm `path` module.
It will ensure that paths are correct on each OS it is running on, example:

**Do not use this**
```
app.use('/', serveStatic(__dirname + '../public'));
```

**Use this**
```
import path from 'path';
app.use('/', serveStatic(path.join(__dirname, '..', 'public')));
```

* https://nodejs.org/docs/latest/api/path.html

The first option would break on windows machine because it uses backslash instead of forward slash.


#### Functions
Use `function` in the global scope and for `Object.prototype` properties.  
Use `=>` everywhere else (in consideration to `this`).


### Server folder structure
* `/app` - holds application logic.
* `/helpers` - holds javascript which isn't application feature but can be used accross the project.
* `/lib` - holds files which don't go anywhere else and are not executable, mostly used for data storage which is not in database.
* `/middlewares` - holds application wide middleware functions, like auth, forceHttps, etc...
* `/models` - each file is one database model coupled with functions to use the model. Only use sequelize in there, then expose the functions to actually manipulate data from outside. User model is good example.
* `/routes` - holds routes for the application. This is entry point from frontend. You should do only minimal needed stuff here and hand it to the `app` as soon as possible.
* `/tasks` - hold node scripts which can be ran on demand. They are not needed for the app, but might contain some maintanance or data update scripts.
* `config.js` - holds config needed for application to run. Keep in mind this is an ES6 module so no dynimic values.
* `database.js` - connects to database, initializes the models (and tables if needed)
* `index.js` - server entry point
* `model-collection.js` - creates tables in the database if needed on init, also exposes the collection of all models in the application.
