import mongoose from 'mongoose'
import Joi from 'joi'
import * as Hoek from '@hapi/hoek'

import { beaconGenomicVariationsSchema } from '../../../../../../../schema/mongoose/beacon/models/genomicVariations/defaultSchema.js'

// hardcoded for now
const beaconConfig = { 
        // maxGranularity: 'boolean',
        // maxGranularity: 'count',
        maxGranularity: 'record',
        maxResultsLimit: 10
      }

const enumBeaconGranularities = {
  boolean:    0,
  count:      1,
  aggregated: 2,
  record:     3
}

// actually should be JOI although, might be good for when the config is migrated to the db?
// also a side-effect of considering mongoose-as-middleware; most of this would be handled by the imagined code-autogeneration framework
// import { beaconRequestBodyQuerySchema } from '../../../../../../../schema/mongoose/beacon/framework/requests/beaconRequestBody.js'

// endpoint specific query params (also the GET params)
const genomicVariationsParamsPayload = Joi.object({

  alternateBases:             Joi.string().pattern( /^([ACGTUNRYSWKMBDHV\-\.]*)$/ ),
  aminoacidChange:            Joi.string(),
  assemblyId:                 Joi.string(),
  end:                        Joi.array().items( Joi.number().integer().min( 0 ) ).min( 0 ).max( 2 ), //could technically be Joi.ref['start'], but wouldn't be official spec?
  entryId:                    Joi.string(), // strictly .required() by spec, but not by reference implementation?
  filters:                    Joi.array().items( Joi.string() ).default( [] ),
  geneId:                     Joi.string(),
  genomicAlleleShortForm:     Joi.string(),
  includeResultsetResponses:  Joi.string().valid( 'ALL', 'HIT', 'MISS', 'NONE' ),
  limit:                      Joi.number().integer().min( 0 ).default( 10 ).max( beaconConfig.maxResultsLimit ).failover( beaconConfig.maxResultsLimit ), // .max( beaconConfig.maxLimit )
  mateName:                   Joi.string(),
  referenceBases:             Joi.string().pattern( /^([ACGTUNRYSWKMBDHV\-\.]*)$/ ),
  referenceName:              Joi.string(),
  requestedSchema:            Joi.string(),
  skip:                       Joi.number().integer().min( 0 ).default( 0 ),
  start:                      Joi.array().items( Joi.number().integer().required().min( 0 ) ).min( 1 ).max( 2 ).optional(),
  variantMaxLength:           Joi.number().integer().min( 0 ),
  variantMinLength:           Joi.number().integer().min( 0 ),
  variantType:                Joi.string()

}) // .concat(beaconRequestBodyPayload)


const genomicVariationsPostParamsPayload = Joi.object({
  query: Joi.object({
    requestParameters:         genomicVariationsParamsPayload,
    requestedGranularity:      Joi.string().valid( 'boolean', 'count', 'aggregated', 'record' ).default( beaconConfig.maxGranularity ),
    testMode:                  Joi.boolean().default( true ).failover( true ),
    filters:                   genomicVariationsParamsPayload.extract( 'filters' ),
    includeResultsetResponses: Joi.string().valid( 'ALL', 'HIT', 'MISS', 'NONE' ).default( 'HIT' ),
    pagination:                Joi.object({
      limit:        genomicVariationsParamsPayload.extract( 'limit' ),
      skip:         genomicVariationsParamsPayload.extract( 'skip' ),
      currentPage:  Joi.string(),
      nextPage:     Joi.string(),
      previousPage: Joi.string()
    })
  })
})

// simplify access to request parameters across GET / POST queries
// set returnedGranularity here
// todo: memory usage considerations ;)
const parseRequestParams = function( req ){

    var retParams = {}
    if( req.method == "post" ){
      // needed for the receivedRequestSummary
      retParams.orig = req.payload.query 
      // clone the payload query ( shallow copy the sub-property ) into our "api"
      retParams.api  = Hoek.clone( req.payload.query, { shallow: [ 'requestParameters' ] } )
      delete( retParams.api.requestParameters )
      // merge sub-property contents into our "api" version
      Hoek.merge( retParams.api, Hoek.reach( req, 'payload.query.requestParameters', { default: {} } ) )
    }

    // already flattened `so-to-speak`
    if( req.method == "get" ){
      retParams.orig = Hoek.reach(req, 'query', { default: {} })
      retParams.api  = Hoek.clone(retParams.orig)
    }
    
    return retParams

}

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
  
  // genomicVariationsQuery.select( publicFieldsProjection )
  genomicVariationsQuery.count()


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


