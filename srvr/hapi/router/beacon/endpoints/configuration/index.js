import mongoose from 'mongoose'
import { beaconConfigurationResponseSchema } from '../../../../../../schema/mongoose/beacon/framework/responses/beaconConfigurationResponse.js'


//const beaconConfigurationResponseModel = mongoose.model( 'endpoint-configuration', beaconConfigurationResponseSchema )

/*
 import + instantiate schema
 instantiate model
 retrieve document / values from db
 create hapi-route-handler
 export route object
*/

/* this is a candidate for generalisation 
 * db querying functions in ../../plugin/BeaconRouter.js ??
*/
const getBeaconConfiguration = async function(x){
	
	// beaconConfigurationResponseModel.create()
  const z = new beaconConfigurationResponseModel()
  console.log( z )
	return '<pre>{ "beaconConfigurationResponseModel": ' + z + '}</pre>'
  
}

const beaconConfigurationResponseRouteHandler = async function( req, res ){
	// const bir = await getBeaconConfiguration()
	return res.response( "<pre>" + JSON.stringify(beaconConfigurationResponseSchema.paths,null,2) + "</pre>" )
}

const beaconConfigurationResponseRoute = { 
      method:  ['GET','POST'],
      path:    '/configuration',
      handler: beaconConfigurationResponseRouteHandler
}

/* might use this later?
const beaconConfigurationResponse = {
	schema: beaconConfigurationResponseSchema,
	model:  beaconConfigurationResponseModel,
	route:  beaconConfigurationResponseRoute
}
*/

export { beaconConfigurationResponseRoute, beaconConfigurationResponseSchema }
