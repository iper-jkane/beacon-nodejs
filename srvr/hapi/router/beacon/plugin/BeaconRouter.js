import Boom from '@hapi/boom' 
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

// console.log( glob.sync( '../endpoints/index.js' ) )
//.forEach( function( file ) {
//  require( file );
//});


const defaultOptions = {
  route: {
    method:  ['*'],
    path:    '/{path*}',
    handler: function( req, res ) {
      return Boom.notAcceptable('You have offended this api server!');
    }
  }
}

const BeaconRouter = {

  pkg: {
    name: 'BeaconRouter',
    version: '0.1.0'
  },

  // multiple: true,
  register: async function (server, options) {
  
    const mdbOptions = { connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 500 } 

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
    
		// console.log(server)
		// await server.register( { plugin: HapiAutoRoute, options: {
						// routes_dir: Path.join(__dirname, '../endpoints')
					// }})
		// server.dependency('hapi-auto-route', async (server, next) => { 
		// 	await server.register( { plugin: HapiAutoRoute } )
		// 	next() 
		// });


    const opts = { ...defaultOptions, ...options } 

    // add beacon routes
    // try to use glob, or even db?
    server.route( rootRoute ) 
    server.route( beaconInfoResponseRoute )
    server.route( beaconConfigurationResponseRoute )

    server.route({
        method:  opts.route.method,
        path:    opts.route.path,
        handler: opts.route.handler 
    });


  }

};


export { BeaconRouter };
