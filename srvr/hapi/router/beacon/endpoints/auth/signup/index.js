import Joi from 'joi'

const authLoginPayload = Joi.object({
  user:  Joi.string().min( 4 ).max( 9 ).required(),
  pass:  Joi.string().min( 8 ).max( 22 )
           .pattern( new RegExp( /^[0-9A-Za-z\p{P}]+$/ ) )
           .required()
           .messages( { 'string.pattern.invert.base': 'Error: Bad username or password' } )
}).label( "auth-login-payload" )

const authSignUpPayload = authLoginPayload.append({
  email: Joi.string().email({
           tlds: false // for testing only
  }).required()
}).label( "auth-signup-payload" )

const authSignUpRoute = {
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
}

export { authSignUpRoute }

