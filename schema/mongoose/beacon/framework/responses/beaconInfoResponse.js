import mongoose from 'mongoose'

import { beaconInformationalResponseMetaSchema } from './sections/beaconInformationalResponseMeta.js' 
import { beaconInfoResultsSchema }               from './sections/beaconInfoResults.js'

const beaconInfoResponseSchema = new mongoose.Schema({
  response: { type: beaconInfoResultsSchema,               default: {} },
      meta: { type: beaconInformationalResponseMetaSchema, default: {} },
}, { collection: 'config.beaconInfoResponse' })

export { beaconInfoResponseSchema }
