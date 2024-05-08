import { authorizationCorsHeaders } from '../common.js'

const authLoginRoute = [

  {
    method: [ 'OPTIONS' ],
    options: {
      auth: false
    },
    path: '/auth/login',
    handler: authorizationCorsHeaders
  },

  {
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
        return res.response( { authResponse: req.auth.credentials } )
    }
  }
]

export { authLoginRoute }
