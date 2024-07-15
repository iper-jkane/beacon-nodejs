import Boom from '@hapi/boom' 
import { BeaconAuth } from './BeaconAuth.js'
import { StatusCode } from 'status-code-enum'
import { glob } from 'glob'
import HapiAutoRoute from 'hapi-auto-route'
import * as dotenv from 'dotenv'

import Path from 'path'
import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { rootRoute }                        from '../endpoints/root.js'
import { beaconInfoResponseRoute }          from '../endpoints/info/index.js'
import { beaconConfigurationResponseRoute } from '../endpoints/configuration/index.js' 
import { beaconGenomicVariationsRoute }     from '../endpoints/models/genomicVariations/index.js'

const BeaconRouter = {

  pkg: {
    name: 'BeaconRouter',
    version: '0.6.0'
  },

  register: async function (server, options) {

    console.log( "Registering: BeaconRouter" )
   
    server.dependency( 'BeaconMongo' )
    server.dependency( 'BeaconAuth' )
    
    // serve up the routes  
    server.route( rootRoute )
    server.route( beaconInfoResponseRoute )
    server.route( beaconConfigurationResponseRoute )
    server.route( beaconGenomicVariationsRoute )


  } // register
}; // plugin

export { BeaconRouter }
