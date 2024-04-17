import mongoose from 'mongoose'
import Joi from 'joi'
import * as Hoek from '@hapi/hoek'


import { beaconGenomicVariationsSchema } from '../../../../../../../schema/mongoose/beacon/models/genomicVariations/defaultSchema.js'

const beaconGenomicVariationsParamsPayload = Joi.object({

  alternateBases:             Joi.string().pattern(/^([ACGTUNRYSWKMBDHV\-\.]*)$/),
  aminoacidChange:            Joi.string(),
  assemblyId:                 Joi.string(),
  end:                        Joi.array().items( Joi.number().integer().min(0) ).min(0).max(2), //could technically be Joi.ref['start'], but wouldn't be official spec?
  entryId:                    Joi.string(), // strictly .required() by spec, but not by reference implementation?
  filters:                    Joi.array().items( Joi.string() ),
  geneId:                     Joi.string(),
  genomicAlleleShortForm:     Joi.string(),
  includeResultsetResponses:  Joi.string().valid('ALL','HIT','MISS','NONE'), 
  limit:                      Joi.number().integer().min(0).default(10).max(10).failover(10), // .max( beaconConfig.maxLimit )
  mateName:                   Joi.string(),
  referenceBases:             Joi.string().pattern(/^([ACGTUNRYSWKMBDHV\-\.]*)$/),
  referenceName:              Joi.string(),
  requestedSchema:            Joi.string(),
  skip:                       Joi.number().integer().min(0).default(0),
  start:                      Joi.array().items( Joi.number().integer().required().min(0) ).min(1).max(2).optional(),
  variantMaxLength:           Joi.number().integer().min(0),
  variantMinLength:           Joi.number().integer().min(0),
  variantType:                Joi.string()

}) 

const getBeaconGenomicVariations = async function(req){

  // make function mergeRequestParameters(...)
  const reqPayload = req.payload ? req.payload : {}
  const reqQuery   = req.query ? req.query : {}
  const reqParams = Hoek.applyToDefaults( reqPayload, reqQuery )

  // use existing mongoose / mongodb connection
  const mdb = req.server.plugins.BeaconRouter.mdb
  
  var beaconGenomicVariationsModel = mdb.models['beaconGenomicVariationsModel']
  // move to top-lvl; i.e., register the models at srvr startup
  if ( ! beaconGenomicVariationsModel ){
    beaconGenomicVariationsModel = mdb.model('beaconGenomicVariationsModel', beaconGenomicVariationsSchema, beaconGenomicVariationsSchema.options.collection) 
  }

  const queryFilter = {}
  const publicFieldsProjection = { _id: 0, variantInternalId: 1, variation: 1 }

  var genomicVariationsQuery = beaconGenomicVariationsModel.find( queryFilter )
  
  genomicVariationsQuery.select( publicFieldsProjection )
  // genomicVariationsQuery.count() 

  
  const gVariants = await genomicVariationsQuery.exec()
  // if( beaconConfig.strictMode ){ await gVariants.validate() }
  return gVariants 
  
}

const beaconGenomicVariationsRouteHandler = async function( req, res ){
    const gVariants = await getBeaconGenomicVariations(req)
    console.log( req.payload, req.query )
    return res.response( { payload: req.payload, query: req.query, gvars: gVariants } )
}

// requires methods be split, because of hapi validation logic
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


