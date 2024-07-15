import HapiJwt from '@hapi/jwt'
import bcrypt from 'bcrypt'

import { beaconAuthUsersSchema } from '../../../../../../schema/mongoose/beacon/auth/users.js'

// global settings, because: jwt plugin registration 
const jwtClaims = {
  aud: 'urn:audience:bioinfo',
  iss: 'urn:issuer:thisServer', // + req.server.info,
  sub: 'urn:subject:<uuid>'
}

const authFetchCredsMongo = async function( mdb, user, opt = {} ){

  var beaconAuthUsersModel = mdb.models['beaconAuthUsersModel']
  return await beaconAuthUsersModel.findOne( { user: user } )
  
}

// hapi plugin helper methods; it makes sense they have access to `server`
const authFetchCreds = async function( server, user, opts = {} ){

  const mdb = server.plugins.BeaconMongo.mdb 
  // check authCache and conditionally pull from db (and fill cache), then null, or error
  try {
    const foundUser = await authFetchCredsMongo( mdb, user )
    if( foundUser !== undefined && foundUser !== null ){

      foundUser.isValid = true
      return foundUser

    }else{

      console.log("Couldn't Find User: ", user)
      return { isValid: false }

    }

  }catch(err){

    console.log("authFetchCredsError: ", err)
    throw(err) // if auth is broken, the app is broken!

  }
}

// todo: joi payload validation of authUser
const authValidateUser = async function( authUser, user, pass ){
  if( authUser.isValid && authUser.enabled ) {
    return await bcrypt.compare(pass, authUser.pass )
  }
  return false
}

const authValidateCreds = async (req, user, pass, res) => {

  // server knows best...
  const authData = await authFetchCreds( req.server, user )
  // Guinness...good things, etc...
  if( await authValidateUser( authData, user, pass ) ) {

    // basic auth validation return payload 
    return authGenUserJwtReturnPayload(authData)

  } // endif

  return { isValid: false }

}

const authValidateJwt = async function(art,req,res){
  // happens post token decode; we can do AuthZ (aka payload validation) here.
  // MUST check user 
  return { isValid: true, credentials: { tokenPayload: art.decoded.payload } }
}


const authGenUserJwtReturnPayload = function(authData) {

  const retCreds = {
    user: authData.user,
    aud: jwtClaims.aud,
    iss: jwtClaims.iss,
    sub: jwtClaims.sub,
    scope: authData.jwt.scope,
    group: 'bioinfos',
    beaconConfig: { allowedGranularities: authData.beaconConfig.allowedGranularities }
  }

  const retJwtToken = HapiJwt.token.generate(

    retCreds,

    {
        key: authData.jwt.key,
        algorithms: authData.jwt.algorithms
    },

    {
        ttlSec: 3*3600 // 3-hours should be enough for anybody...
    }
  )

  return { 
    isValid: true, 
    credentials: { 
      authZData: retCreds,
      msg: "Auth Success!",
      jwt: retJwtToken,
    } 
  } 
}


// as we're using the inbuilt jwt "plugin" and simultaneously abusing jwt tokens as session authorizers
// we have to compile an array of enabled accounts / users:

const authGenUserJwtKeys = async function(mdb) {

  const beaconAuthUsersModel = mdb.models['beaconAuthUsersModel']
  var enabledUsers = []
  try {
    var enabledUsers = await beaconAuthUsersModel.find( { enabled: true }, { _id: 0, uid: 1, user: 1, enabled: 1, jwt: 1 } )
    if (enabledUsers.length > 0) {
      enabledUsers = enabledUsers.map( ( user ) => { if ( user.enabled ) { return { key: user.jwt.key, algorithms: user.jwt.algorithms, kid: `${user.uid}` } } } ) 
    } else {
      console.log("Warning: No Enabled Users Found!")
    } 
  } catch(err) {
    console.log("Error| authGenUserJwtKeys: ", err)
  }
  console.log(enabledUsers)
  return enabledUsers
// validJwtKeys.push({ key: 'foo', algorithms: ['HS511'], kid: 'hostJwtKid' })
}

export { authFetchCreds, authValidateUser, authValidateJwt, authValidateCreds, authGenUserJwtReturnPayload, authGenUserJwtKeys, jwtClaims } 

