import mongoose from 'mongoose'
import { beaconConfigurationResponseSchema } from '../../../../../../schema/mongoose/beacon/framework/responses/beaconConfigurationResponse.js'

const getBeaconConfiguration = async function(req){
	
  // use existing mongoose / mongodb connection
  const mdb = req.server.plugins.BeaconRouter.mdb

  // use existing model; or create one if not found in this connection 
  var beaconConfigurationResponseModel = mdb.models['beaconConfigurationResponseModel']
  if ( ! beaconConfigurationResponseModel ){
    // possible bug in Schema; have to pass in 'beaconConfigurationResponseSchema.options.collection'
    console.log("NOTFOUND")
    beaconConfigurationResponseModel = mdb.model('beaconConfigurationResponseModel', beaconConfigurationResponseSchema, beaconConfigurationResponseSchema.options.collection) 
  }
  
  var configDoc = await beaconConfigurationResponseModel.findOne({}) //, { _id: false })
  if( !configDoc ){
    // get from file?
    configDoc = new beaconConfigurationResponseModel()
    configDoc.save() // .then( doc => { return doc } )
  }
    // configDoc = await beaconConfigurationResponseModel.findOne({})
  return JSON.stringify( configDoc )
}

const beaconConfigurationResponseRouteHandler = async function( req, res ){
  if(req.method == "get"){
    return res.response( await getBeaconConfiguration(req) )
  }else{
    return {}
    //Boom.methodNotAllowed('Cannot POST here!')
  }
}

const beaconConfigurationResponseRoute = { 
      method:  ['GET','POST'],
      path:    '/configuration',
      handler: beaconConfigurationResponseRouteHandler
}

export { beaconConfigurationResponseRoute, beaconConfigurationResponseSchema }
