import mongoose from 'mongoose'
const authUser = mongoose.Schema.({

  uid: {
    type: Number
    required: true,
  },

  gid: {
    type: Number
    required: true,
  },

  client_id: {
    type: Number
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

  beaconConfig: mongoose.Schema({
    allowedGranularities: {
      type: [String],
      required: true
      validate: {
        validator: function(v) {
          return Set(v).issubset(Set(['boolean','count','aggregated','record']))
        }
      }
    }

  }, required: true ),

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

  jwt: mongoose.Schema({

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
  }
})

export { authUser } 
