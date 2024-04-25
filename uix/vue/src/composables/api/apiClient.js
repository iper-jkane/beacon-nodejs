import axios from 'axios'
import createAxiosCache from 'axios-cache-plugin'
import { StatusCode } from 'status-code-enum'

const beaconApiUrl   = new URL( process.env.VUE_APP_BNJS_API_URL )
console.log("beaconApiUrl: ", beaconApiUrl)

const beaconApiHost  = beaconApiUrl.hostname
const beaconApiPort  = beaconApiUrl.port
const beaconApiProto = beaconApiUrl.protocol.slice(0,-1)

let axiosClient = axios.create({
  withCredentials: false,
  method: 'post',
  baseURL: beaconApiUrl.href,
})

let axiosCache = createAxiosCache(
  axiosClient, {
    maxCacheSize: 15,
    ttl: 30000
  }
)


const apiClient = {
  _client: axiosClient,

  basicAuth: function() {},
  parseError: function(err, opts = { messageOnly: true }) {

    var retErr = { isClientError: true }

    if ( err.name == "AxiosError" ){

      if( err.code == "ERR_BAD_RESPONSE" ){
        retErr.statusCode = StatusCode.ServerErrorInternal
        retErr.message = "Oh No! " + err.response.data.error // "Interal Server Error"
      }

      if( err.code == "ERR_NETWORK" ){
        retErr.message = "Network Failed: Check Connection / API"
        retErr.statusCode = StatusCode.ClientIsATeapot  }

      if( err.code == "ERR_BAD_REQUEST" ){

        retErr.statusCode = err.response.data.statusCode
        if( err.response.status == StatusCode.ClientErrorUnauthorized ){
          switch( err.response.data.message ) {
            case "HTTP authentication header missing username":
            case "Bad username or password":
              retErr.message = "Bad username or password." // "Ah. Ah. Ah. You didn't say the magic word!"
              break
            case "Bad HTTP authentication header format":
              retErr.message = "Invalid Authorization Header / JWT"
              break
            default:
              retErr.message = err.response.data.message // "** IMPROPER REQUEST **"
          }
        }
        if( err.response.status == StatusCode.ClientErrorConflict ){ // 409
          //nothing special; in fact probably merge into the outer block ERR_BAD_REQUEST
          retErr.message = "Query Invalid: " + err.response.data.message
          retErr.statusCode = err.response.status
        }
      }
    } else {
      retErr.isClientError = false
      retErr.statusCode = 418
      retErr.message = `Error ${retErr.statusCode}: I'm a Teapot! (check console)`
    }

    // our definition of...
    if ( ! retErr.isClientError ){
      console.log("apiClient.parseError.err: ", err )
      console.log("apiClient.parseError.retErr: ", retErr )
    }

    if ( opts.messageOnly ){
      return retErr.message
    } else {
      return retErr
    }
  },

  parseResponse: function(resp) {
    if ( resp.status == StatusCode.SuccessOK ) {
      return resp.data
    }

    return {}
  },

  fetch: async function ( url, data = {}, opts = {} ){

    var authBasic = {}
     if ( opts.auth == 'basic' ) {
       authBasic = {
         username: sessionStorage.getItem('auth.username'),
         password: sessionStorage.getItem('auth.password')
       }
     }
    var headers = {}
    if ( opts.accessToken !== undefined ) {
      // tokens take precedence
      authBasic = null
      headers = { 'authorization': `Bearer ${opts.accessToken}` }
    }

   // ugly; because: axios.
    return this._client({
      url: url,
      auth: authBasic ? authBasic : null,
      data: data,
      headers: headers
    })

  }
}

export { apiClient }
