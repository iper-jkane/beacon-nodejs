import Hapi from '@hapi/hapi';
import Path from 'path'
import fs from 'fs'

import { fileURLToPath, parse } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { BeaconRouter } from './router/beacon/plugin/BeaconRouter.js'

import * as dotenv from 'dotenv'

const nodeEnvFile = process.env.NODE_ENV ? ".env." + process.env.NODE_ENV : ".env"
dotenv.config({ path: nodeEnvFile })

const beaconApiUrlStr = process.env.BNJS_API_URL ? process.env.BNJS_API_URL : 'https://0.0.0.0:9001'
const beaconApiUrl   = parse(beaconApiUrlStr)

const beaconApiHost  = beaconApiUrl.hostname
const beaconApiPort  = beaconApiUrl.port
const beaconApiProto = beaconApiUrl.protocol.slice(0,-1)

const corsOrigins = process.env.BNJS_API_CORS_ORIGINS ? process.env.BNJS_API_CORS_ORIGINS.split(',') : [ 'https://localhost:8080' ]

// console.log( "corsOrigins: ", JSON.stringify(corsOrigins) )
// console.log( `${beaconApiProto}://${beaconApiHost}:${beaconApiPort}` )

const hbsrv= new Hapi.Server({
  port: beaconApiPort,
  host: beaconApiHost,
  tls: {
    key:  fs.readFileSync(__dirname + '/tls/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/tls/server-cert.pem'),
  },
  routes: {
    cors: {
      origin: corsOrigins,
      maxAge: 86400,
      headers: [ 'Accept', 'Authorization', 'Content-Type', 'If-None-Match' ],
      additionalHeaders: [ 'WWW-Authenticate' ],
      exposedHeaders: [ 'WWW-Authenticate', 'Server-Authorization' ],
      additionalExposedHeaders: [ 'Authorization' ],
      credentials: false,
    }
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

