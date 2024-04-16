import mongoose from 'mongoose'

const beaconGenomicVariationsSchema = mongoose.Schema({

    variantInternalId: {
      type: String,
      required: true
    },

    // LegacyVariation
    variation: {
      type: new mongoose.Schema({
        _id: false, // sub-doc

        alternateBases: {
          type: String,
          validate: /^([ACGTUNRYSWKMBDHV\-\.]*)$/,
          required: true
        },

        variantType: {
          type: String,
          required: true
        }

      }),
      required: true
    }

}, { collection: 'genomicVariations' })
export { beaconGenomicVariationsSchema }
