import mongoose from 'mongoose'

import { beaconInformationalResponseMetaSchema } from './sections/beaconInformationalResponseMeta.js'
import { beaconConfigurationSchema } from '../configuration/beaconConfigurationSchema.js'

const beaconConfigurationResponseSchema = new mongoose.Schema()

beaconConfigurationResponseSchema.add( beaconInformationalResponseMetaSchema )
beaconConfigurationResponseSchema.add( beaconConfigurationSchema )

export { beaconConfigurationResponseSchema }
