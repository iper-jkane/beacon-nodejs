import Boom from '@hapi/boom'
import { OpenAPIRequestValidator, beaconModelEndpointsJsonFile } from '../plugin/utils/openapi.js'

import SwaggerParser from "@apidevtools/swagger-parser";

const rootRoute = [
 
  // minimal set of rules to keep everything hapi
  {
    // handle favicon  
    method: ['GET'],
    path: '/favicon.ico', // {path*}',
    handler: function( req, res ) {
      // make use of @hapi/inert?
      return res.response()
               .type('image/x-icon')
               .code(StatusCode.SuccessNoContent)
    }
  },
  
  {
    // return the pre-built client
    // I predict a reverse-proxy in your future... ;)
    method: ['GET'],
    path: '/',
    options: {
      auth: false,
      files: { relativeTo: '../../uix/vue/dist' },
    },
    handler: {
      directory: {
          path: '.', 
      },
    }
  },

  {
    // catchall
    method: ['GET','POST'],
    path: '/{path*}',
    handler: function( req, res ) {
      return Boom.notAcceptable('You have offended this api server! ' + req.path);
    }
  }
]

export { rootRoute }
