import HapiBasic from '@hapi/basic'

import HapiJwt from '@hapi/jwt'
import * as Hoek from '@hapi/hoek'
import Boom from '@hapi/boom' 
import Joi from 'joi'
import { StatusCode } from 'status-code-enum'
import bcrypt from 'bcrypt'
import Path from 'path'
import {inspect} from 'util'

import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

const BeaconAuth = {

  pkg: {
    name: 'BeaconAuth',
    version: '0.1.0'
  },

  register: async function (server, options) {

    // register this plugin
    console.log("Registering: BeaconAuth")
    
    // register hapi basic auth plugin, and/or others perhaps, depending on node.ENV / config, etc...
    await server.register(HapiBasic)
    await server.register(HapiJwt)

    // basic auth structure for development; migrate to file, db, or turnkey solution
    // initially a simple user/pass combo + jwt / iana nomenclature: https://www.iana.org/assignments/jwt/jwt.xhtml
    // this so it can provide authN + authZ data 
    // to follow the beacon reference implementation would be to eventually align oauth scopes and beacon granularities
    // clients MIGHT need secret keys handing out + config stage.
    const authDb = {
      clients: [ 
                 { 
                   client_id: 900, 
                   client_name: "BioInst1", 
                   client_secret: "c20fd1ae-8eb8-49d3-9a17-56c617546616", // uuid returned as jti (jwt id) 
                   // remoteAddress, X-Forwarded-For, X-Real-Ip
                   ips_allowed: [ "10.10.10.1/32", "127.0.0.1/24", "10.128.0.0/24" ]
                 }
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
                 pass:           "$2b$12$O9oo7dWbDgAPikRY8gAogeh7TRJ9ZctihsckEBKwVUexoGfjsAW1K", // foo
               }
             ]
    }

    const jwtClaims = {
      aud: 'urn:audience:bioinfo',
      iss: 'urn:issuer:thisServer', // + req.server.info,
      sub: 'urn:subject:<uuid>'
    }

    const validateCreds = async (req, user, pass, res) => {
      if( Hoek.contain(authDb.users, { "user": user }, { deep: true, part: true } ) ){

        // switch over to node-argon2id
        const bpass = await bcrypt.compare(pass, authDb.users[0].pass );
        if ( bpass ){
          return { isValid: true, credentials: { jwt: "jwtoken" } }
        }
        
      }
      return { isValid: false }  
    } 

    server.auth.strategy('basic', 'basic', { validate: validateCreds });
    //server.auth.default('basic');

    const authLoginPayload = Joi.object({
                                          user:  Joi.string().min(4).max(9).required(),
                                          // pass:  Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
                                          pass:  Joi.string().pattern(/^foo$/).required().messages({ 'string.pattern.base': 'Error: Bad username or password'}) //|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/,{invert: true}).required().messages({ 'string.pattern.invert.base': 'Error: Bad username or password'})
          }).label("auth-login-payload")

    // console.log( authLoginPayload.validate({ user: "foob", pass: "foo" }) )
    const authSignUpPayload = authLoginPayload.append({
                                          email: Joi.string().email({
                                                   tlds: false // for testing only
                                                 }).required() 
                                        }).label("auth-signup-payload")
    // console.log(authSignUpPayload.validate({ user: "foob", pass: "foo", email: "foo@dev.null" }))

    server.route({
      method:  ['POST'],
      path:    '/auth/signup',
      handler: function( req, res ) {
        return req.payload
      },
      options: {
        auth: false,  
        validate: {
          options: {
            abortEarly: false,
            errors: { escapeHtml: true },
            debug: false
          },
          payload: authSignUpPayload,
          failAction: async function (req, res, err) {
            // # possible bug / feature; wont return message about validating subkeys without this
            if ( req.payload === null ){ 
              console.log("fail:" , authSignUpPayload._ids)
              const authErr = authSignUpPayload.validate({},{ abortEarly: false }).error
              console.log("authErr: ", authErr) 
              return Boom.badRequest(authErr)
            }
            return Boom.badRequest("fa: " + err.output.payload.message)
          }
        }
      }
    })

    // authN
    // fixes CORS pre-flight checks in firefox
    // possible bug with hapi-basic + hapi-cors interaction?
    server.route({
      method: [ 'OPTIONS' ],
      options: {
        auth: false
      },
      path: '/auth/login',
      handler: function( req, res ) {
        const r = res.response()
        r.header('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type,If-None-Match')
        r.header('Access-Control-Allow-Methods', 'POST,GET')
        r.code(204)
        return r
      }
    })

    server.route({
      method: [ 'POST', 'GET' ],
      path: '/auth/login',
      options: {
        auth: {
           strategy: 'basic',  
           mode: 'required'
        },
       },
      handler: function( req, res ) {
          return req.auth
      }
    })

    server.route({
      method: ['post','get'],
      path: '/auth/scope',
      options: {
        auth: {
          strategies: ['basic'],
          mode: 'required',
        }
      },
      handler: function( req, res ) {
          console.log(req.auth)
          return res.response("AuthN Success: just because it's you");
      }
    })
  }
};

export { BeaconAuth };
