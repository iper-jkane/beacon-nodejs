import mongoose from 'mongoose'

// naming scheme is Consistently Awful!⁽™⁾
const beaconAuthUsersSchema = new mongoose.Schema({

  uid: {
    type: Number,
    required: true,
  },

  gid: {
    type: Number,
    required: true,
  },

  client_id: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true
  },

  user: {
    type: String,
    required: true
  },

  pass: {
    type: String,
    required: true
  },

  enabled: {
    type: Boolean,
    required: true, 
  },

  beaconConfig: {
    default: {},
    required: true,
    type: new mongoose.Schema({
      _id: false,
      allowedGranularities: {
        type: [String],
        required: true,
        validate: {
          validator: function( v ) {
            return new Set( v ).issubset( new Set( ['boolean', 'count', 'aggregated', 'record' ] ) )
          }
        }
      }
    })
  },

  given_name: {
    type: String,
  },
  
  family_name: {
    type: String,
  },

  email_verified: {
    type: Boolean,
    default: false
  },

  jwt: {
    default: {},
    type: new mongoose.Schema({

      _id: false,

      key: {
        type: String,
        required: true
      },

      algorithms: { 
        type: [String],
        required: true,
        default: ['HS512']
      },

      aud: { 
        type: String,
        required: true,
        default: 'urn:audience:bioinfo' 
      },

      iss: {
        type: String,
        required: true,
        default: 'urn:issuer:reverseBeaconUri'
      },

      sub: {
        type: String,
        required: true,
        default: 'urn:subject:<email>'
      }
    })
  }
}, { collection: 'beaconAuthUsers' })

export { beaconAuthUsersSchema } 
