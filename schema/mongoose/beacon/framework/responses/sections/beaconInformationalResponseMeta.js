import mongoose from 'mongoose'

const returnedSchemas = mongoose.Schema({
            entity_type: {
              type: String,
              default: "Schemas SHOULD Conform To The GA4GH Specs ;)"
            },
            schema: {
              type: String,
              default: "ga4gh-beacon-schema-v2.0.0"
            }
}, { _id: false })

const beaconInformationalResponseMetaSchema = mongoose.Schema({

      beaconId: {
        type: String,
        required: true,
        default: "example.inst.dept.beacon",
      },

      apiVersion: {
        type: String,
        required: true,
        default: "v2.0",
      },
 
      returnedSchemas: {
        type: [returnedSchemas],
        required: true,
        default: [{}]
      } 
}, { _id: false })

export { beaconInformationalResponseMetaSchema }

// ToConvertToMongoose
// {
//   "$schema": "http://json-schema.org/draft-07/schema",
//   "description": "Meta information about the response.",
//   "type": "object",
//   "properties": {
//     "beaconId": {
//       "description": "Identifier of the beacon, as defined in `Beacon`.",
//       "$ref": "../../common/beaconCommonComponents.json#/definitions/BeaconId"
//     },
//     "apiVersion": {
//       "description": "Version of the API.",
//       "$ref": "../../common/beaconCommonComponents.json#/definitions/ApiVersion"
//     },
//     "returnedSchemas": {
//       "$ref": "../../common/beaconCommonComponents.json#/definitions/ListOfSchemas"
//     }
//   },
//   "$comment": "TO REVIEW: the required properties below results in a warning in the example.",
//   "required": ["beaconId", "apiVersion", "returnedSchemas"],
//   "additionalProperties": true
// }
