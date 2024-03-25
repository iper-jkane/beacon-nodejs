import Hapi from '@hapi/hapi';
// import Boom from '@hapi/boom';
import process from 'node:process'
import Path from 'path'
import fs from 'fs'
import { BeaconRouter } from './router/beacon/plugin/BeaconRouter.js'

import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

const hbsrv= new Hapi.Server({
  port: 9001,
  // host: 'localhost',
  host: '0.0.0.0',
  tls: {
    key:  fs.readFileSync(__dirname + '/tls/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/tls/server-cert.pem'),
  },
  routes: {
    cors: true,
  },
  router: { 
    isCaseSensitive: true, 
    stripTrailingSlash: true 
  },
  debug: { request: ['*'] }
})

const crank = async () => {

  await hbsrv.register({  
    plugin: BeaconRouter,
  });

  await hbsrv.start();
  console.log('Server running on %s', hbsrv.info.uri);

}

process.on('unhandledRejection', (err) => {
  console.log("nodeEvent: " + err);
})

/* crank up the server */
crank();

