import { beaconAuthUsersSchema } from '../../../../../../schema/mongoose/beacon/auth/users.js'

// todo: make generic / factory
const buildIndexes = async function ( model, opts = {} ) {

  // if( opts.forceRebuild ){  }

  const beaconAuthUsersModel = model // tmp
  // until we can workout why Schema.index(...) + Model.createIndexes() isn't working...for composite keys
  await beaconAuthUsersModel.db.db.command({
    // Index All The Things! -- I mean don't really, but they are here as options for now;
    createIndexes: beaconAuthUsersSchema.options.collection, 
    indexes: [ 
      { name: 'user',  key: { 'user': 1 }, unique: true },
    ] 
  })

}

// todo: make generic / factory
const initAuthUsersModel = async function( mdb, opts = {} ) {

  // if( opts.forceRecreate ){  }

  // exists?  
  var beaconAuthUsersModel = mdb.models['beaconAuthUsersModel']
  if ( beaconAuthUsersModel === undefined ){

    // create model -- try/catch
    beaconAuthUsersModel = await mdb.model('beaconAuthUsersModel', beaconAuthUsersSchema, beaconAuthUsersSchema.options.collection)
    // build indexes
    buildIndexes(beaconAuthUsersModel)

  }

} 

export { initAuthUsersModel }
