import mongoose from 'mongoose'
import { beaconConfigurationResponseSchema } from '../../../../../../schema/mongoose/beacon/framework/responses/beaconConfigurationResponse.js'

const getBeaconConfiguration = async function(x){
	
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

export { beaconConfigurationResponseRoute, beaconConfigurationResponseSchema }
