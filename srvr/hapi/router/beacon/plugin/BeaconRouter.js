import Boom from '@hapi/boom' 
import { BeaconAuth } from './BeaconAuth.js'
import { StatusCode } from 'status-code-enum'
import glob from 'glob'
import HapiAutoRoute from 'hapi-auto-route'
import * as dotenv from 'dotenv'

import Path from 'path'
import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { rootRoute }                        from '../endpoints/root.js'
import { beaconInfoResponseRoute }          from '../endpoints/info/index.js'
import { beaconConfigurationResponseRoute } from '../endpoints/configuration/index.js' 
import { beaconGenomicVariationsRoute }     from '../endpoints/models/genomicVariations/index.js'

import { initGenomicVariationsModel } from '../endpoints/models/genomicVariations/init.js'


const foo = function() {
  console.log("gihfgjhf" )
}

const BeaconRouter = {

  pkg: {
    name: 'BeaconRouter',
    version: '0.5.0'
  },

  register: async function (server, options) {
 
    server.dependency('BeaconMongo')
    server.dependency('BeaconAuth', foo )
    
    // sub-plugin called after mdb instance, but before routes, can use existing connection; lazy

    // serve up the routes  
    server.route( beaconInfoResponseRoute )
    server.route( beaconConfigurationResponseRoute )
    server.route( beaconGenomicVariationsRoute )
    server.route( rootRoute )


  } // register
}; // plugin

export { BeaconRouter }
