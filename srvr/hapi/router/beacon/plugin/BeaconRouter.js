import Boom from '@hapi/boom' 
import { BeaconAuth } from './BeaconAuth.js'
import { StatusCode } from 'status-code-enum'
import glob from 'glob'
import mongoose from 'mongoose'
import HapiAutoRoute from 'hapi-auto-route'
import Path from 'path'
import * as dotenv from 'dotenv'

import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { rootRoute }                        from '../endpoints/root.js'
import { beaconInfoResponseRoute }          from '../endpoints/info/index.js'
import { beaconConfigurationResponseRoute } from '../endpoints/configuration/index.js' 
import { beaconGenomicVariationsRoute }     from '../endpoints/models/genomicVariations/index.js'

const BeaconRouter = {

  pkg: {
    name: 'BeaconRouter',
    version: '0.4.0'
  },

  register: async function (server, options) {
 
    // connect to database
    // establish
    
    const mdbOptions = { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 500 }

    // using dotenv whilst open-sourcing this first attempt
    dotenv.config({ path: __dirname + "/.env" })
    const mdbHost   = process.env.mdbHost
    const mdbPort   = process.env.mdbPort
    const mdbDbName = process.env.mdbDbName 

    try {
      const mdb = await mongoose.connect(`mongodb://${mdbHost}:${mdbPort}/${mdbDbName}?directConnection=true`, mdbOptions)
      server.expose('mdb', mdb )
    }catch(err){
      console.log("ERROR_DB:", err)
      throw("...aaaAAAARRRRGH")
    }
    


    // sub-plugin called after mdb instance, but before routes, can use existing connection; lazy
    await server.register(BeaconAuth)

    server.route( rootRoute )
    server.route( beaconInfoResponseRoute )
    server.route( beaconConfigurationResponseRoute )
    server.route( beaconGenomicVariationsRoute )

    // catchall -- pending tidyup ;)
    server.route({
      method:  ['GET'],
      path:    '/{path*}',
      handler: function( req, res ) {

        // separate path -- make use of @hapi/inert 
        if (req.path == "/favicon.ico"){
          // return res.response("icon")
          return res.response()
          .type('image/x-icon')
          .code(StatusCode.SuccessNoContent);
        }

        return Boom.notAcceptable('You have offended this api server! ' + req.path);
      }
    })

  } // register
}; // plugin


export { BeaconRouter }
