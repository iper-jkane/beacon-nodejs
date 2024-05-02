import mongoose from 'mongoose'

import * as dotenv from 'dotenv'

import Path from 'path'
import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

import { initGenomicVariationsModel } from '../endpoints/models/genomicVariations/init.js'

const BeaconMongo = {

  pkg: {
    name: 'BeaconMongo',
    version: '0.0.1'
  },

  register: async function (server, options) {
 
    console.log("Registering: BeaconMongo")
    const mdbOptions = { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 1000, socketTimeoutMS: 500 }

    // using dotenv whilst open-sourcing this first attempt
    dotenv.config({ path: __dirname + "/.env" })

    // probs switch to BNJS_MDB_URI
    const mdbHost   = process.env.mdbHost
    const mdbPort   = process.env.mdbPort
    const mdbDbName = process.env.mdbDbName 

    const mdbUser = process.env.mdbUser ?? ""
    const mdbPass = process.env.mdbPass ? `:${process.env.mdbPass}@` : ""

    const mdbCreds = `${mdbUser}${mdbPass}`

    try {

      // try and establish a db connection
      const mdb = await mongoose.connect(`mongodb://${mdbCreds}${mdbHost}:${mdbPort}/${mdbDbName}?directConnection=true`, mdbOptions)

      // build collections from models -- maybe move to BeaconRouter or perhaps as a server.dependency hook?
      initGenomicVariationsModel(mdb) 

      //global database connection
      await server.expose('mdb', mdb )

    }catch(err){
      console.log("ERROR_DB:", err)
      throw("...aaaAAAARRRRGH")
    }
  }
}

export { BeaconMongo }
