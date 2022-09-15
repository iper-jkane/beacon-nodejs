import mongoose from 'mongoose'

import { beaconInformationalResponseMetaSchema } from './sections/beaconInformationalResponseMeta.js'
import { beaconConfigurationSchema }             from '../configuration/beaconConfigurationSchema.js'

const beaconConfigurationResponseSchema = new mongoose.Schema({
  response: { type: beaconConfigurationSchema,       default: {} },
      meta: { type: beaconInformationalResponseMetaSchema, default: {} },
}, { collection: 'config.beaconConfigurationResponse' })

export { beaconConfigurationResponseSchema }
