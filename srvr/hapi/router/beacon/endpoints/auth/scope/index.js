import { authorizationCorsHeaders } from '../common.js'

const authScopeRoute = [
  {
    method: [ 'options' ],
    options: {
      auth: {
        strategies: ['basic', 'jwt'],
        mode: 'optional'
      }
    },
    path: '/auth/scope',
    handler: authorizationCorsHeaders
  },

  {
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
  }
]

export { authScopeRoute }
