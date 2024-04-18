import mongoose from 'mongoose'

/* todo filtering terms, etc... */
const beaconRequestBodyQuerySchema = mongoose.Schema({
  query: {

    requestedGranularity: {
      type: String,
      default: "boolean",
      validate: {
        validator: function(v) {
           return [ "boolean", "count", "aggregated", "record" ].includes(v)
         }
      }
    },

    testMode: {
      type: Boolean,
      default: false
    }

  }
})

export { beaconRequestBodyQuerySchema }
