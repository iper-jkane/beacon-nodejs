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

        referenceBases: {
          type: String,
          validate: /^([ACGTUNRYSWKMBDHV\-\.]*)$/,
          // required: true # not required by the spec
        },

        alternateBases: {
          type: String,
          validate: /^([ACGTUNRYSWKMBDHV\-\.]*)$/,
          required: true
        },

        variantType: {
          type: String,
          required: true
        },

        location: {
          type: new mongoose.Schema({
            _id: false,

            interval: {
              type: new mongoose.Schema({

                _id: false,

                type: {
                  type: String,
                  default: "SequenceInterval",
                  match: /^SequenceInterval$/, // enum might be quicker in principle
                  immutable: true,
                  required: true
                },

                start: {
                  type: new mongoose.Schema({
                    _id: false,
                    type: {
                      type: String,
                      default: "Number",
                      match: /^Number$/, // enum might be quicker in principle
                      required: true
                    },

                    value: {
                      type: Number,
                      required: true
                    }
                  }),
                },

                end: {
                  type: new mongoose.Schema({
                    _id: false,
                    type: {
                      type: String,
                      default: "Number",
                      match: /^Number$/, // enum might be quicker in principle
                      required: true
                    },

                    value: {
                      type: Number,
                      required: true
                    }

                  }),
                }

              }),
              required: true
            },

            sequence_id: {
              type: String,
              validate: /^\w[^:]*:.+$/,
              required: true
            },

            type: {
              type: String,
              default: "SequenceLocation",
              match: /^SequenceLocation$/, // enum might be quicker in principle
              immutable: true,
              required: true
            }

          }),
          required: true
        }
      }),
      required: true
    }

}, { collection: 'genomicVariations' })

export { beaconGenomicVariationsSchema }
