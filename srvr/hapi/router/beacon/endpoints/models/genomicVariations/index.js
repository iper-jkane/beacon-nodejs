import mongoose from 'mongoose'
import Joi from 'joi'
import * as Hoek from '@hapi/hoek'
import Boom from '@hapi/boom'

import { beaconGenomicVariationsSchema } from '../../../../../../../schema/mongoose/beacon/models/genomicVariations/defaultSchema.js'

// hardcoded for now
const beaconConfig = {
        // maxGranularity: 'boolean',
        // maxGranularity: 'count',
        maxGranularity: 'record',
        maxResultsLimit: Number.MAX_SAFE_INTEGER // refactor when you hit BigInt ;)
      }

const enumBeaconGranularities = {
  boolean:    0,
  count:      1,
  aggregated: 2,
  record:     3
}

// endpoint specific query params (also the GET params)
const genomicVariationsParamsPayload = Joi.object({

  alternateBases:             Joi.string().pattern( /^([ACGTUNRYSWKMBDHV\-\.]*)$/ ),
  aminoacidChange:            Joi.string(),
  assemblyId:                 Joi.string(),
  end:                        Joi.array().items( Joi.number().integer().min( 0 ) ).min( 0 ).max( 2 ),
  entryId:                    Joi.string(),
  filters:                    Joi.array().items( Joi.string() ).default( [] ),
  geneId:                     Joi.string(),
  genomicAlleleShortForm:     Joi.string().pattern( /[{}$]/,  { invert: true } ).max(256), // not spec -- limit mongodb injection attack vectors -- HGVS nomenclature
  includeResultsetResponses:  Joi.string().valid( 'ALL', 'HIT', 'MISS', 'NONE' ),
  limit:                      Joi.number().integer().min( 0 ).max( beaconConfig.maxResultsLimit ), //.messages({ 'number.max': 'foo'}),
  mateName:                   Joi.string(),
  referenceBases:             Joi.string().pattern( /^([ACGTUNRYSWKMBDHV\-\.]*)$/ ),
  referenceName:              Joi.string(),
  requestedSchema:            Joi.string(),
  skip:                       Joi.number().integer().min( 0 ).default( 0 ),
  start:                      Joi.array().items( Joi.number().integer().required().min( 0 ) ).min( 1 ).max( 2 ).optional(),
  variantMaxLength:           Joi.number().integer().min( 0 ),
  variantMinLength:           Joi.number().integer().min( 0 ),
  variantType:                Joi.string()

}).label('genomicVariationsEndpointParameters')


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

      // GET doesn't define requestedGranularity so we must set a default
      retParams.orig.requestedGranularity = 'boolean'

      // clone
      retParams.api  = Hoek.clone(retParams.orig)

    }

    return retParams

}


const getBeaconGenomicVariations = async function( req, reqParams ){

  // const reqParams = parseRequestParams(req)

  // use existing mongoose / mongodb connection
  const mdb = req.server.plugins.BeaconRouter.mdb
  var beaconGenomicVariationsModel = mdb.models['beaconGenomicVariationsModel']

  // todo: make function + sort out variable passing for reqParams
  var requestedGranularity = enumBeaconGranularities[reqParams.requestedGranularity]
  // const authedGranularity = enumBeaconGranularities[req.auth.artifacts.decoded.jwt.allowedGranularity]
  const maxGranularity = enumBeaconGranularities[beaconConfig.maxGranularity]

  // if ( requestedGranularity <= req.auth.authUser.allowedGranularity <= maxGranularity ) ){
  if( requestedGranularity > maxGranularity ) {
    reqParams.returnedGranularity = beaconConfig.maxGranularity
  }else{
    reqParams.returnedGranularity = reqParams.requestedGranularity
  }

  const endpointParams = reqParams.requestParameters

  var queryFilter = {}
  var publicFieldsProjection = { _id: 0, variantInternalId: 1, variation: 1 }
 
  // testing: input is verified(ish) 
  const gVarQueries = { genomicAlleleShortForm: 'identifiers.genomicHGVSId' }
  //alternateBases: 'variation.alternateBases'
  if( reqParams.genomicAlleleShortForm ) {
    Object.assign( queryFilter, { [ gVarQueries.genomicAlleleShortForm ]: reqParams.genomicAlleleShortForm } )
    // Object.assign( publicFieldsProjection, { caseLevelData:1 } )
    // publicFieldsProjection = {}
  }
 
  // used to build mongoose query 
  var genomicVariationsQuery

  switch ( reqParams.returnedGranularity ){
    case 'boolean':
      genomicVariationsQuery = beaconGenomicVariationsModel.findOne( queryFilter )
      break
    case 'count':
      genomicVariationsQuery = beaconGenomicVariationsModel.countDocuments( queryFilter )
      break
    case 'aggregated':
      // page left blank
      break
    case 'record':
      genomicVariationsQuery = beaconGenomicVariationsModel.find( queryFilter )
      genomicVariationsQuery.select( publicFieldsProjection )

      // request limitation
      const maxLimit = beaconConfig.maxResultsLimit
      var   reqLimit = reqParams.limit

      // if requested by user
      if ( typeof reqLimit === 'number' ){

        // enforce maxResultsLimit
        if ( reqLimit == 0 || reqLimit > maxLimit ) {
          reqLimit = maxLimit
        }

        genomicVariationsQuery.limit( reqLimit )

      }
      break
  }

  const gVariants = await genomicVariationsQuery.exec()
  // if( beaconConfig.strictMode ){ // Query.exec().cursor().asyncEach( doc.validate() ) }
  // need to wrap the results in their appropriate "object"
  return gVariants

}

const beaconGenomicVariationsRouteHandler = async function( req, res ){

    const reqParams = parseRequestParams(req)
    const gVariants = await getBeaconGenomicVariations( req, reqParams.api )

    var beaconGenomicVariationsResponse = {
          meta: {
            receivedRequestSummary: reqParams.orig,
            returnedGranularity: reqParams.api.returnedGranularity
          }
        }

    switch ( reqParams.api.returnedGranularity ){
      case 'boolean':
        beaconGenomicVariationsResponse.responseSummary = { exists: ( gVariants !== null ) }
        break
      case 'count':
        beaconGenomicVariationsResponse.responseSummary = { exists: ( gVariants > 0 ), numTotalResults: gVariants }
        break
      case 'aggregated':
        beaconGenomicVariationsResponse.responseSummary = { schemaUndocumented: true }
        break
      case 'record':
        beaconGenomicVariationsResponse.response = { resultSets: [ { id: "CINECA", results: gVariants } ] }
        break
    }

    return res.response( beaconGenomicVariationsResponse )
}

// requires methods be split, because of hapi validation logic
const beaconGenomicVariationsRoute = [
  {
        method:  ['POST'],
        path:    '/g_variants',
        options: {
          auth: 'basic',
          validate: {
            payload: genomicVariationsPostParamsPayload,
            options: {
              abortEarly: false
            },
            failAction: async function (req, res, err) {
              // return informative errors in relation to paramater validation
              return Boom.conflict(err)
            }
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
            query: genomicVariationsParamsPayload
          }
        },
        handler: beaconGenomicVariationsRouteHandler
  }
]


export { beaconGenomicVariationsRoute } //, beaconGenomicVariationsSchema }
