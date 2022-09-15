import mongoose from 'mongoose'

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
    }, { _id: false })

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
      type: Object,
      required: true,
      default: {
        // something not right here...confused: meta-schemas / from db? 
        // literally the models-dirs?
        dataset: { 
          id: { type: String, default: "datasets" },
          name: { type: String, default: "Datasets" },
          description: { type: String, default: "A Dataset is a collection of records, like rows in a database or cards in a cardholder." },
          ontologyTermForThisType: { type: String, default: "NCIT:C47824" }, 
          partOfSpecification: { type: String, default: "beacon-v2.0" },
          defaultSchema: { 
            id: { type: String, default: "beacon-dataset-v2.0" },
            name: { type: String, default: "Dataset Default Schema" },
            referenceToSchemaDefinition: { type: String, default: "./datasets/defaultSchema.json" },
            schemaVersion: { type: String, default: "v2.0" }
          }
        }
      }
    }
  }

}, { _id: false })

/*
     required: true,
     default: {
       // something not right here...confused: meta-schemas / from db? 
       // literally the models-dirs?
       dataset: { 
         id: { type: String, default: "datasets" },
         name: { type: String, default: "Datasets" },
         description: { type: String, default: "A Dataset is a collection of records, like rows in a database or cards in a cardholder." },
         ontologyTermForThisType: { type: String, default: "NCIT:C47824" }, 
         partOfSpecification: { type: String, default: "beacon-v2.0" },
         defaultSchema: { 
           id: { type: String, default: "beacon-dataset-v2.0" },
           name: { type: String, default: "Dataset Default Schema" },
           referenceToSchemaDefinition: { type: String, default: "./datasets/defaultSchema.json" },
           schemaVersion: { type: String, default: "v2.0" }
         }
       }
     }
   }
 }
})
}, { _id: false })
*/
export { beaconConfigurationSchema }
