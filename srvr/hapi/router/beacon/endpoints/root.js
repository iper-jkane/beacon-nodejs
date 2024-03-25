import Boom from '@hapi/boom'
import { OpenAPIRequestValidator, beaconModelEndpointsJsonFile } from '../plugin/utils/openapi.js'

import SwaggerParser from "@apidevtools/swagger-parser";

const rootRoute = [
  {
    method:  ['GET','POST'],
    path:    '/',
    options: {
      auth: false
    },
    handler: async function( req, res ) {
      // return Boom.notAcceptable('(root) You have offended this api server!');
      // return Vue client code as god intended...
      if ( req.method == 'post' ){ 
        // console.log(beaconModelEndpoints)
        // console.log(req.payload)
        const openApiParser = new SwaggerParser()
        // console.log(openApiParser)
       
        try { 
          // console.log( api.$refs.paths() )
          
          // console.log(api)
          // console.log( "validateError: " + errors )
        }catch(err){
          console.log( "catch:" + err )
        }
        return { "youPosted": "weRecieved" } //req.payload }
      }
      return "VUE CLIENT"
    },
  }
]

export { rootRoute }
