import Boom from '@hapi/boom'
import Joi from 'joi'
import { StatusCode } from 'status-code-enum'

import Path from 'path'
import { fileURLToPath } from 'url'
const __dirname = Path.dirname(fileURLToPath(import.meta.url))

import { initAuthUsersModel } from '../endpoints/auth/init.js'

import { authSignUpRoute } from '../endpoints/auth/signup/index.js' 
import { authLoginRoute }  from '../endpoints/auth/login/index.js' 
import { authScopeRoute }  from '../endpoints/auth/scope/index.js'

import { authFetchCreds, 
         authValidateCreds, 
         authValidateUser,
         authValidateJwt, 
         authGenUserJwtReturnPayload, 
         authGenUserJwtKeys,
         jwtClaims 
       } from './utils/auth.js' 

const BeaconAuth = {

  pkg: {
    name: 'BeaconAuth',
    version: '0.3.0'
  },

  register: async function (server, options) {

    // register this plugin
    console.log("Registering: BeaconAuth")

    server.dependency('BeaconMongo')
    server.dependency('@hapi/basic')
    server.dependency('@hapi/jwt')

    var validJwtKeys = []

    // expensive; but it's at startup -- still; need a cache!
    const mdb = server.plugins.BeaconMongo.mdb 
    try {

      await initAuthUsersModel(mdb)
      validJwtKeys = await authGenUserJwtKeys(mdb)

    } catch( err ){

      throw("BeaconAuth: A serious misconfiguration or db error: ", err )

    }

    // basic auth strategy 
    server.auth.strategy('basic', 'basic', { validate: authValidateCreds })
    // routes
    server.route( authSignUpRoute )
    server.route( authLoginRoute )

    // jwt auth strategy and routes
    if ( validJwtKeys.length > 0 ) {
  
      server.auth.strategy('jwt', 'jwt', { keys: validJwtKeys,
      // verify: false,
                                           verify: {
                                            aud: jwtClaims.aud,
                                            iss: jwtClaims.iss,
                                            sub: jwtClaims.sub
                                           },

                                           validate: authValidateJwt })    //server.auth.default('basic')


      server.route( authScopeRoute )

    } else {
      console.log("Warning| NoValidJWTKeys (check users in db)")
      console.log("Warning| Disabling some routes: [ authScopeRoute ]")
    }
  }
}

export { BeaconAuth }
