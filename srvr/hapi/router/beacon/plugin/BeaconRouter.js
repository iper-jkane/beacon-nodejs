import Boom from '@hapi/boom' 
import * as Hoek from '@hapi/hoek'
import { StatusCode } from 'status-code-enum'
import hapiBasic from '@hapi/basic'
import bcrypt from 'bcrypt'
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

const defaultOptions = {
  route: {
    method:  ['*'],
    path:    '/{path*}',
    handler: function( req, res ) {

      // separate path?
      if (req.path == "/favicon.ico"){ 
        return res.response()
        .type('image/x-icon')
        .code(StatusCode.SuccessNoContent);
      }
  
      return Boom.notAcceptable('You have offended this api server! ' + req.path);
  
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
 
    // register hapi basic auth plugin
    await server.register(hapiBasic); 
    
    // basic auth structure for development; migrate to file, db, or turnkey solution 
    // initially a simple user/pass combo + jwt / iana nomenclature: https://www.iana.org/assignments/jwt/jwt.xhtml
    // this so it can provide authN + authZ data 
    // to follow the beacon reference implementation would be to eventually align oauth scopes and beacon granularities
    const authDb = {
      clients: [ 
                 { 
                   client_id: 900, 
                   client_name: "BioInst1", 
                   client_secret: "c20fd1ae-8eb8-49d3-9a17-56c617546616", // uuid returned as jti (jwt id) 
                   // remote address
                   // X-Forwarded-For
                   // X-Real-Ip
                   ips_allowed: [ "10.10.10.1/32", "127.0.0.1/24", "10.128.0.0/24" ]                 }
     ],

      users: [
               { 
                 uid: 1000,
                 gid: 1000,
                 client_id: 900,
                 given_name:     "Biolo",
                 family_name:    "Gist",
                 email:          "null@dev.null",
                 email_verified: true,
                 user:           "bgist",
                 pass:           "$2b$12$O9oo7dWbDgAPikRY8gAogeh7TRJ9ZctihsckEBKwVUexoGfjsAW1K",
               }
             ]
    };

    const validateCreds = async (req, user, pass, res) => {
      console.log("validateCreds: " + req.url);
      console.log("req.auth: " + JSON.stringify(req.auth, null, 2));
      console.log("user: " + user);
      console.log("pass: " + pass);
      if ( Hoek.contain(authDb.users, { user: user } )){ 
      return { isValid: true, credentials: { jwt: "Foo" } }
      }
      return { isValid: false }  
    } 

    server.auth.strategy('basic', 'basic', { validate: validateCreds });
    // server.auth.default('basic');

 
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
    
    const opts = { ...defaultOptions, ...options } 

    server.route( rootRoute ) 
    server.route( beaconInfoResponseRoute )
    server.route( beaconConfigurationResponseRoute )

    // authN
    server.route({
      method: ['post','get'],
      path: '/auth/{path}',
      options: {
        auth: 'basic'
      },
      handler: function( req, res ) {
        if ( req.path == "/auth/login" ){
          return res.response("AuthN Success: just because it's you");
        }
        return res.response({ msg: 'Not Actually An Error, Boom!', statusCode: 201, madeUp: "stuff", path: req.path });
      }
    })

    server.route({
        method:  opts.route.method,
        path:    opts.route.path,
        handler: opts.route.handler 
    });

  }

};


export { BeaconRouter };
