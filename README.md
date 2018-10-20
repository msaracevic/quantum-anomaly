# Quantum Anomaly Website

## Prerequesites to run locally and develop

[Node](https://nodejs.org/en/) and [Nodemon](https://www.npmjs.com/package/nodemon) globally installed and postgres database.  
Node version min `6.11.x`  
NPM version min `5.3.x`

On your local, you need to create `.env` file in `server` folder of project. Content of the file is supposed to be

```
DATABASE_URL=postgres://Username:Password@Host:Port/DatabaseName
DATABASE_SECRET=YourSecret

PORT=YourPort
USER_AGENT={'User-Agent': 'UserAgentForBackendInitiatedAjaxCalls'}
GOOGLE_CLIENT_ID=YourGoogleClientId
GOOGLE_CLIENT_SECRET=YourGoogleClientSecret
GOOGLE_CALLBACK_URL=YourGoogleClientCallback
REGISTRATION=True/False

ESI_UPDATES_ENABLED=True/False

EMAIL_CLIENT_ID=GoogleSmtpUsername
EMAIL_CLIENT_PASS=GoogleSmtPassword

WARFRAME_EMAILS=ComaSeparetedEmails
```

* Google client ID, secret and callback can be skipped if you comment out `auth` from `server/index.js` _(keep in mind that disables options to secure routes behind login walls)_
* Registration set on true will enable users to create new account with their google account
* Email client can be skipped if there is no need to send out emails. It is also disabled on development mode.
* ESI updated enable mounting of the routes which populate EVE database

#### NPM tasks
Currently there are 3 `package.json` files because this is technically 2 projects. 

`/server` folder handles `node` code. It has following scripts:
- `npm run start` runs `express` server which starts your backend (uses `Nodemon`)
- `npm run build` builds files in `server` with babel and outputs to `/build` folder (production task)

`/frontend` folder handles `react` code. It has following scripts:
- `npm run start` starts react dev server and compiles assets, also starts `sass` watchers
- `npm run build` builds react file for production ready environment and outputs to `/frontend/build`

To run project you need to run both `npm run start` scripts.  
Keep in mind that `react` frontend is running inside webpack development server which is set to proxy to port 3000. If you are using some other port for your server you will need to update `package.json` in `/frontend` folder.  

Last `package.json` is there just for Heroku, it sets the proper node and npm versions and triggers build tasks for both frontend and backend. It is located in root of the project.  

### Populate database
If you choose to run this locally, you need to populate your database with EVE Online database data.  
* `ESI_UPDATES_ENABLED` should be enabled, this will mount `/tasks/` and output in server console `ESI tasks routes are loaded`  
* To run full blown update visit `/tasks/update-all` 
  * **WARNING**: this task is deliberately slowed down because it is requesting all the data via API, it's expected to run for about 30 minutes, so don't abuse it

### Contribution guide
##### Github branches
* `master` branch is ALWAYS stable and deployed code
* `develop` branch is stable code base used as main branch from which to checkout for development
* feature branches are created as needed
  * name should indicate general task being done on the branch
  * `-` instead of ` `, no other special characters allowed, lowercase
  
**Never** run `rebase` or `amend` commands on `master` or `develop` branches 
  
##### Developing new features
- Branch out from develop `git checkout -b 'new-branch-name'`
- Work on related code and commit as you see fit 
- After work is finished, commit and do final check, amend any mistakes in commit messages, squash if needed, etc.
- Checkout to develop, pull and rebase new branch
  - `git checkout develop`
  - `git pull`
  - `git checkout new-branch-name`
  - `git rebase develop`
  - resolve conflicts during rebase
- Push branch to remote `git push origin new-branch-name`
- Create pull request to `develop` branch
- Go over the PR yourself at least once and look if it makes sense, if something is out of place, etc.
- Assign people to review code

##### Commit naming 
Commit messages are in format of 

```
Type: Short description

- optional additional point
- optional additional point
```

Type can be `feature`, `fix`, `refactor`, `chore`.

Example:
```
Feature: Force https on production environments

 - add option to force https
 - make this default on production
```
or without extra points
```
Feature: Force https on production environments
```
on branch `https`


## Stack

### Backend

Backend is running on [node express](https://www.npmjs.com/package/express) server with [sequelize](https://www.npmjs.com/package/sequelize)
used for Postgres database management. Authentication is being done with `('passport-google-oauth').OAuth2Strategy;`  
Config file: `server/config.js`  
Main database file: `server/database.js`  
Main routes file: `routes/index.js`

### Frontend

Frontend is running on [React](https://facebook.github.io/react/) and it is based on [create-react-app](https://github.com/facebookincubator/create-react-app). It is also using `sass` for css.  
CSS entry point is: `/frontend/src/styles/main.scss`, base css is contained inside `/frontend/src/styles/` folder, while components are directly in `/frontend/src/components/`  
React entry point is: `/frontend/src/index.js`

### Javascript code guide  
**[Javascript code guide](./documentation/javascript.md)** _(code guide based on [clean-code-javascript](https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/README.md))_

### CSS code guide 
**[CSS guide](./documentation/css.md)** 
- CSS is written with [sass](https://sass-lang.com/guide)
- CSS has it's own compiler, it is not tied into webpack / react
- [BEM notation](http://getbem.com/introduction/) is applied naming convention
