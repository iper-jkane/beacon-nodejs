import { beaconGenomicVariationsSchema } from '../../../../../../../schema/mongoose/beacon/models/genomicVariations/defaultSchema.js'

// todo: make generic / factory
const buildIndexes = async function ( model, opts = {} ) {
    
  // if( opts.forceRebuild ){  }

  const beaconGenomicVariationsModel = model // tmp
  // until we can workout why Schema.index(...) + Model.createIndexes() isn't working...for composite keys
  await beaconGenomicVariationsModel.db.db.command({
    // Index All The Things! -- I mean don't really, but they are here as options for now;
    createIndexes: beaconGenomicVariationsSchema.options.collection, 
    indexes: [ 
      { name: 'variantInternalId',  key: { 'variantInternalId':              1 }, unique: true },
      { name: 'biosampleId',        key: { 'caseLevelData.biosampleId':      1 }, partialFilterExpression: { 'caseLevelData.biosampleId': { $exists: true } } },
      { name: 'genomicHGVSId',      key: { 'identifiers.genomicHGVSId' :     1 } },
      { name: 'sequenceId',         key: { 'variation.location.sequence_id': 1 } }
    ] 
  })

}

// todo: make generic / factory
const initGenomicVariationsModel = async function( mdb, opts = {} ) {

  // if( opts.forceRecreate ){  }

  // exists?  
  var beaconGenomicVariationsModel = mdb.models['beaconGenomicVariationsModel']
  if ( beaconGenomicVariationsModel === undefined ){

    // create model -- try/catch
    beaconGenomicVariationsModel = await mdb.model('beaconGenomicVariationsModel', beaconGenomicVariationsSchema, beaconGenomicVariationsSchema.options.collection)
    // build indexes
    buildIndexes(beaconGenomicVariationsModel)

  }

} 

export { initGenomicVariationsModel }
