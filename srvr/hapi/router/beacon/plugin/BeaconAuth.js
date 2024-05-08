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

      // console.log( err )  
      throw("BeaconAuth: A serious misconfiguration or db error: ", err )

    }


    server.auth.strategy('basic', 'basic', { validate: authValidateCreds })
    server.auth.strategy('jwt', 'jwt', { keys: validJwtKeys,
      // verify: false,
                                         verify: {
                                          aud: jwtClaims.aud,
                                          iss: jwtClaims.iss,
                                          sub: jwtClaims.sub
                                         },
                                         validate: authValidateJwt })    //server.auth.default('basic')

    server.route( authSignUpRoute )
    server.route( authLoginRoute )
    server.route( authScopeRoute )

  }
}

export { BeaconAuth }
