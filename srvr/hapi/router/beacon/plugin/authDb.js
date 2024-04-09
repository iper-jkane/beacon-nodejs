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

export { authDb }  
