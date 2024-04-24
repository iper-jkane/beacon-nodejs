import HapiBasic from '@hapi/basic'
import HapiJwt from '@hapi/jwt'
import * as Hoek from '@hapi/hoek'
import Boom from '@hapi/boom'
import Joi from 'joi'
import { StatusCode } from 'status-code-enum'
import Path from 'path'
import {inspect} from 'util'

// incremental steps toward db integration...
import { authDb, authFetchCreds, authValidateUser } from './utils/authDb.js' 

import { fileURLToPath } from 'url'
const __dirname = Path.dirname(fileURLToPath(import.meta.url))

const BeaconAuth = {

  pkg: {
    name: 'BeaconAuth',
    version: '0.2.1'
  },

  register: async function (server, options) {

    // register this plugin
    console.log("Registering: BeaconAuth")

    // register hapi basic auth plugin, and/or others perhaps, depending on node.ENV / config, etc...
    await server.register(HapiBasic)
    await server.register(HapiJwt)

    const jwtClaims = {
      aud: 'urn:audience:bioinfo',
      iss: 'urn:issuer:thisServer', // + req.server.info,
      sub: 'urn:subject:<uuid>'
    }

    const validateCreds = async (req, user, pass, res) => {

      // server knows best...
      const authData = authFetchCreds( server, user )
      // Guinness...good things, etc...
      if( await authValidateUser( authData, user, pass ) ) {


          const retCreds = 
                {
                    user: user,
                    aud: jwtClaims.aud,
                    iss: jwtClaims.iss,
                    sub: jwtClaims.sub,
                    scope: authDb.users[0].jwt.scope,
                    group: 'bioinfos',
                    beaconConfig: { allowedGranularities: authDb.users[0].beaconConfig.allowedGranularities }
                }

          const jwt = HapiJwt.token.generate(
                retCreds,
                {
                    key: authDb.users[0].jwt.key,
                    algorithms: authDb.users[0].jwt.algorithms
                },
                {
                    ttlSec: 3*3600 // 3-hours should be enough for anybody...
                }
            )

          return { isValid: true, 
                   credentials: { 
                     authZData: retCreds,
                     msg: "Auth Success!",
                     jwt: jwt,
                   } 
                 } 

        }

      return { isValid: false }

    }

    const validateJwt = async function(art,req,res){
      // happens post token decode; we can do AuthZ (aka payload validation) here.
      // MUST check user 
      return { isValid: true, credentials: { tokenPayload: art.decoded.payload } }
    }

    // as we're using the inbuilt jwt "plugin" and simultaneously abusing jwt tokens as session authorizers
    // we have to compile an array of enabled accounts:
    const validJwtKeys = authDb.users.map( (user) => { if (user.enabled) { return { key: user.jwt.key, algorithms: user.jwt.algorithms, kid: `${user.uid}` } } } )
    validJwtKeys.push({ key: 'foo', algorithms: ['HS512'], kid: 'hostJwtKid' })
    console.log(validJwtKeys)

    server.auth.strategy('basic', 'basic', { validate: validateCreds })
    server.auth.strategy('jwt', 'jwt', { keys: validJwtKeys,
      // verify: false,
                                         verify: {
                                          aud: jwtClaims.aud,
                                          iss: jwtClaims.iss,
                                          sub: jwtClaims.sub
                                         },
                                         validate: validateJwt })    //server.auth.default('basic')

    const authLoginPayload = Joi.object({
                                          user:  Joi.string().min(4).max(9).required(), //.messages({ 'string.pattern.base': 'Error: Bad username or password'  }),
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

const authorizationCorsHeaders = function( req, res ) {
        const r = res.response()
        r.header('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type,If-None-Match')
        r.header('Access-Control-Allow-Methods', 'POST,GET')
        r.code(204)
        return r
      }

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
      handler: authorizationCorsHeaders
    })

    server.route({
      method: [ 'POST' ],
      path: '/auth/login',
      options: {
        auth: {
           strategy: 'basic',  
           mode: 'required'
        },
        plugins: {
          jwt: false
        }
       },
      handler: function( req, res ) {
          //console.log("aL.rac: ", req.auth.credentials)
          // return res.response({ access_token: req.auth.credentials.jwt, token_type: 'Bearer' })
          return res.response( { authResponse: req.auth.credentials } )
      }
    })

    // fixes CORS pre-flight checks in firefox
    // possible bug with hapi-basic + hapi-cors interaction?
    server.route({
      method: [ 'options' ],
      options: {
        auth: {
          strategies: ['basic', 'jwt'],
          mode: 'optional'
        }
      },
      path: '/auth/scope',
      handler: authorizationCorsHeaders
    })

    server.route({
      method: ['post','get'],
      path: '/auth/scope',
      options: {
        auth: {
          strategies: ['jwt'],
          mode: 'required',
        }
      },
      handler: function( req, res ) {
        console.log("aS.rh: ", req.headers)
        return res.response({ 
            msg: "AuthN Success: just because it's you",
            rap: req.auth.artifacts.decoded 
        })
      }
    })
  }
}

export { BeaconAuth }
