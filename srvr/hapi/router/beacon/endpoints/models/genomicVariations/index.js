import mongoose from 'mongoose'
import Joi from 'joi'

// import { beaconGenomicVariationsResponseSchema } from '../../../../../../schema/mongoose/beacon/framework/responses/beaconGenomicVariationsResponse.js'

const beaconGenomicVariationsParamsPayload = Joi.object({

  alternateBases:             Joi.string(),
  aminoacidChange:            Joi.string(),
  assemblyId:                 Joi.string(),
  end:                        Joi.array().items( Joi.number().integer().min(0) ).min(0).max(2), //could technically be Joi.ref['start'], but wouldn't be official spec?
  entryId:                    Joi.string(), // strictly .required() by spec, but not by reference implementation?
  filters:                    Joi.array().items( Joi.string() ),
  geneId:                     Joi.string(),
  genomicAlleleShortForm:     Joi.string(),
  includeResultsetResponses:  Joi.string().valid('ALL','HIT','MISS','NONE'), 
  limit:                      Joi.number().integer().min(0).default(10),
  referenceBases:             Joi.string(),
  referenceName:              Joi.string(),
  requestedSchema:            Joi.string(),
  skip:                       Joi.number().integer().min(0).default(0),
  start:                      Joi.array().items( Joi.number().integer().required().min(0) ).min(1).max(2).optional(),
  variantMaxLength:           Joi.number().integer().min(0),
  variantMinLength:           Joi.number().integer().min(0)

}) 

const getBeaconGenomicVariationsResponse = async function(req){

  // use existing mongoose / mongodb connection
  const mdb = req.server.plugins.BeaconRouter.mdb
  
  var infoDoc = await beaconGenomicVariationsResponseModel.findOne({}) //, { _id: false })

  return infoDoc 
  
}

const beaconGenomicVariationsRouteHandler = async function( req, res ){
    // return res.response( await getBeaconGenomicVariationsResponse(req) )
    console.log( req.payload, req.query )
    return res.response( { payload: req.payload, query: req.query } )
}

const beaconGenomicVariationsRoute = [ 
{ 
      method:  ['POST'],
      path:    '/g_variants',
      options: {
        auth: 'basic',
        validate: {
          payload: beaconGenomicVariationsParamsPayload
        }
      },
      handler: beaconGenomicVariationsRouteHandler
},
{ 
      method:  ['GET'],
      path:    '/g_variants',
      options: {
        auth: 'basic',
        validate: {
          query:   beaconGenomicVariationsParamsPayload 
        }
      },
      handler: beaconGenomicVariationsRouteHandler
}
]


export { beaconGenomicVariationsRoute } //, beaconGenomicVariationsSchema }


