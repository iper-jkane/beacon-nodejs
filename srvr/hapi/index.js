import Hapi from '@hapi/hapi';
import HapiBasic from '@hapi/basic'
import HapiJwt from '@hapi/jwt'
import HapiInert from '@hapi/inert'
import Path from 'path'
import fs from 'fs'

import { fileURLToPath, parse } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { BeaconMongo  } from './router/beacon/plugin/BeaconMongo.js'
import { BeaconAuth   } from './router/beacon/plugin/BeaconAuth.js'
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

const beaconSrvrOptions = {

  port: beaconApiPort,
  host: beaconApiHost,
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

}

// add tls config options if URL specifies https protocol
if( beaconApiProto == 'https' ){
  Object.assign( beaconSrvrOptions, { 
    tls: {
      key:  fs.readFileSync(__dirname + '/tls/server-key.pem'),
      cert: fs.readFileSync(__dirname + '/tls/server-cert.pem'),
    } 
   }) 
}

const hbsrv = new Hapi.Server( beaconSrvrOptions )

// useful; perhaps make optional
hbsrv.events.on('route', (r) => { console.log(`  routeAdded: (${r.method}) -> ${r.path}` ) } )

const crank = async () => {

  // register plugins
  await hbsrv.register([
    HapiBasic,   // '@hapi/basic'
    HapiJwt,     // '@hapi/jwt'
    HapiInert,   // '@hapi/inert'
    BeaconMongo,
    BeaconAuth,
    BeaconRouter,
  ])

  // spin-up
  await hbsrv.start();
  console.log('Server running on %s', hbsrv.info.uri)

}

process.on('unhandledRejection', (err) => {
  console.log("nodeEvent: " + err);
})

/* crank up the server */
crank();
