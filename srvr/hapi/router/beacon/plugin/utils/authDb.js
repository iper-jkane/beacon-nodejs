import bcrypt from 'bcrypt'

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
      enabled:        true, 
      user:           "bgist",
      pass:           "$2b$12$O9oo7dWbDgAPikRY8gAogeh7TRJ9ZctihsckEBKwVUexoGfjsAW1K", // foo,
      jwt: { // abusing jwts for fun and...
        key: 'foobar', // each user is it's own jwt-auth server. haha.
        algorithms: ['HS512'],
        aud: 'urn:audience:bioinfo',
        iss: 'urn:issuer:reverseBeaconUri', // + req.server.info,
        sub: 'urn:subject:<email>',
        endpoints: [
          {
            path:               '/auth/scope',
            granularities: [ 'boolean' ], //  , 'count', 'record' ]
            isBeacon: false
          }
        ]
      }
    }
  ]
}

// hapi plugin helper methods; it makes sense they have access to `server`
const authFetchCreds = function( server, user, opts = {} ){

  // check authCache and conditionally pull from db (and fill cache), then null, or error
  try {
    const foundUser = authDb.users.find( (u) => { return u.user == user } )
    if( foundUser !== undefined ){

      foundUser.isValid = true
      console.log(foundUser)
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

export { authDb, authFetchCreds, authValidateUser } 
