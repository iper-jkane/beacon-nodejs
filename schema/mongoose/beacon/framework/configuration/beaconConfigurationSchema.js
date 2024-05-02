import mongoose from 'mongoose'

const beaconEntryTypesSchema = new mongoose.Schema({

  defaultEntryType: { 
    default: {},
    type: new mongoose.Schema({

      id: {
        type: String,
        default: "A (unique) identifier of the element.",
      },

      name: {
        type: String,
        default: "A distinctive name for the element.",
      },

      partOfSpecification: {
        type: String,
        default: "Beacon v2.0.0-draft.4",
      },

      ontologyTermForThisType: {
        default: {},
        type: new mongoose.Schema({

          //CURIE
          id: {
            type: String,
            default: "EXA:ONTOLOGICAL.F00",
            // validate: /^\\w[^:]+:.+$/
            validate: /^\w[^:]+:.+$/
          },

          label: {
            type: String,
            default: "Example Ontology"
          },


        }, { _id: false })
      },
      
      defaultSchema: {
        default: {},
        type: new mongoose.Schema({
          id: {
            type: String,
            default: "ga4gh-beacon-dataset-v2.0.0-draft.4",
          },

          name: { 
            type: String,
            default: "Default schema for datasets",
          },

          referenceToSchemaDefinition: { 
            type: String, 
            default: "./datasets/defaultSchema.json",
          },

          schemaVersion: {
            type: String, 
            default: "v2.0.0-draft.4"
          },
        }, { _id: false }),
      },
    }, { _id: false }) 
  }
}, { _id: false})

const beaconConfigurationSchema = mongoose.Schema({

  "$schema": {
    type: String,
    default: "https://json-schema.org/draft/2020-12/schema"
  },

  maturityAttributes: {
    default: {}, //must be empty for default-cascade
    type: new mongoose.Schema({ 
        productionStatus: { 
          type: String,
          default: "DEV",
          enum: ["DEV","TEST","PROD"],
          validate: {
            validator: function(v) {
               return ["DEV","TEST","PROD"].includes(v)
            }
          }
        }
      }, { _id: false })
  },

  securityAttributes: {
    default: {}, //must be empty for default-cascade
    type: new mongoose.Schema({
      _id: false,

      defaultGranularity: {
        type: String,
        default: "boolean",
        enum: ["boolean", "count", "aggregated", "record"],
        validate: {
          validator: function(v) {
            return ["boolean", "count", "aggregated", "record"].includes(v)
          }
        }
      }

    })
  },

  securityLevels: {
      type: [String],
      required: true,
      default: ["CONTROLLED"],
      // validate: {
      //   validator: function(v) {
      //     return Set(v).issubset(Set(["PUBLIC", "REGISTERED", "CONTROLLED"]))
      //   }
      // }
    },

  entryTypes: {
      default: {},
      type: beaconEntryTypesSchema 
  }

}, { _id: false })

export { beaconConfigurationSchema }
