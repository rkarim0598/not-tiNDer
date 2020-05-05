# tiNDer

An dating application for the discerning Notre Dame, Holy Cross, or Saint Mary's student providing a more laid-back environment than mainline dating apps.

## Installation

The frontend and backend both require dependency installation before use. This is as simple as running `npm install` in both the `app` and `server` directories. In addition, your individual environment settings will need to be set up before you serve the first time. We have provided template environment files for this purpose saved as `.env~`. Simply copy this to `.env` in each directory and customize to your individual configuration.

As well, it is necessary to set up the Oracle server. Make sure there is a user that can be used and set the `ORACLEDB_USER` and `ORACLEDB_PASSWORD` .env variables as such (the defaults are guest/guest). Make sure to additionally run the `./server/sql-funcs/loaddata` script to populate the database and create the requisite tables.

## Running

### Development

Once the dependencies are installed and the database configured, running is very simple. In one terminal navigate into `app` and run `npm run serve` and in another terminal run `npm run start`. The frontend will automatically refresh and update for changes to the HTML while the backend will have to be restarted for any changes.

### Production

Though this configuration was not set up by the authors, it is simple enough to direct vue to build the production version of the application into the `client` subfolder of the `server` folder with the base url of `/client` and simply run the server as normal.