import mongoose from 'mongoose'

// we hope to eventually auto-generate the mongoose schemas using the official api-spec json-schemas
// and perhaps use a configuration file / environment variable / user-interface to set and/or modify the default values...
//
const beaconInfoResultsSchema = mongoose.Schema({
    // required ["bid", "name", "apiVersion", "environment", "organization"],
    // eslint-disable-next-line
      id: { // can't use id with vue as id is reserved :( :( :(
        /* desc: Unique identifier of the Beacon. Use reverse domain name notation. */
        type: String,
        default: "example.inst.dept.beacon",
        // required: true
      },

      name: {
        /* desc: Name of the Beacon. */
        type: String,
        default: "Inst-Dept Beacon",
        // required: true
      },

    apiVersion: {
      type: String,
      /* desc: Version of the API provided by the Beacon. */
      default: "v2.0",
      // required: true
    },

    environment: {
      type: String,
      default: "dev",
      // required: true
      /* desc: Environment the service is running in. Use this to distinguish\nbetween production, development and testing/staging deployments. */
      validate: {
        validator: function(v) {
           return ["prod", "test", "dev", "staging"].includes(v)
         },
      }
    },
    organization: {
      /* desc: Organization owning the Beacon. */
      type: new mongoose.Schema({ 
          // required ["id", "name"],
          id: {
            type: String,
            /* desc: Unique identifier of the organization. */
            default: "example.inst.dept.beacon",
          },
          name: {
            type: String,
            /* desc: Name of the organization. */
            default: "Institute"
          },
          description: {
            type: String,
            /* desc: Description of the organization. */
            default: "The Institute..."
          },
          address: {
            type: String,
            /* desc: Address of the organization. */
            default: "Internet"
          },
          welcomeUrl: {
            type: String,
            /* desc: URL of the website of the organization (RFC 3986 format). */
            default: "https://localhost:8080"
          },
          contactUrl: {
            type: String,
            /* desc: URL with the contact for the Beacon operator/maintainer, e.g. link to a contact form (RFC 3986 format) or an email (RFC 2368 format). */
          },
          logoUrl: {
            type: String,
            /* desc: URL to the logo (PNG/JPG/SVG format) of the organization (RFC 3986 format). */
          },
          info: {
            /* desc: Additional unspecified metadata about the host Organization. */
            type: Object,
            default() {
              return { foo: "bar" }
            }
          }
        }, { _id: false }), default: {} },
      // required: true
      //
    description: {
      type: String,
      /* desc: Description of the Beacon. */
      default: "A Beacon Of Genomic Variation"
    },
    version: {
      type: String,
      /* desc: Version of the Beacon. */
      default: "v0.2.0"
    },
    welcomeUrl: {
      type: String,
      /* desc: URL to the welcome page for this Beacon (RFC 3986 format). */
      default: "https://localhost:8080/" // or create specific?
    },
    alternativeUrl: {
      type: String,
      /* desc: Alternative URL to the API, e.g. a restricted version of this Beacon (RFC 3986 format). */
      default: "https://localhost:8080/restricted"
    },
    createDateTime: {
      type: String,
      /* desc: The time the Beacon was created (ISO 8601 format). */
      default: "2022-06-15"
    },
    updateDateTime: {
      type: String,
      /* desc: The time the Beacon was updated in (ISO 8601 format). */
      default: "2022-06-15T23:43:25Z"
    },
    info: {
      /* desc: Additional unspecified metadata about the Beacon service. */
      type: Object,
      default: () => {
      /*  additionalInfoKey1: "additionalInfoValue1",
        additionalInfoKey2: ["additionalInfoValue2", "additionalInfoValue3"]
      }*/
      }
    },
}, 
  { _id: false }
)
export { beaconInfoResultsSchema }
