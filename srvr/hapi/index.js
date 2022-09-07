import Hapi from '@hapi/hapi';
// import Boom from '@hapi/boom';
import process from 'node:process'
import { BeaconRouter } from './router/beacon/plugin/BeaconRouter.js'

const hbsrv= new Hapi.Server({
  port: 9001,
  host: 'localhost',
  routes: {
    cors: true,
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

