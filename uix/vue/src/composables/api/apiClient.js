import axios from 'axios'
import createAxiosCache from 'axios-cache-plugin'

console.log( "VUE_APP_BNJS_UIX_URL: ", process.env.VUE_APP_BNJS_UIX_URL )
console.log( "VUE_APP_BNJS_API_URL: ", process.env.VUE_APP_BNJS_API_URL )

const beaconApiUrl   = new URL( process.env.VUE_APP_BNJS_API_URL )
console.log("beaconApiUrl: ", beaconApiUrl)

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
  client: axiosClient,
  parseErrorMsg: function(err) { 
    console.log('parseErrorMsg: ', err)
    if ( typeof err.clientError == 'undefined' ){
      err.clientError = { message: "meta:coudln't parse error" }
    }
    return err.clientError.message
  },
  defaultInterceptor: axiosClient.interceptors.response.use(

    (resp) => {
       console.log("axios.default.resp: ", resp )
       return { ...resp.data, status: resp.status } ?? { apiWeirdness: "see console..." }
     },

     (err) => { 
       console.log("axios.default.err:", err )

       // Custom messages for apiClient errors
       if ( err.response ){
         if( err.name == "AxiosError" ){
            err.name = "ClientError: "
            if( err.message == "Network Error" ){
              err.message = "Check Network or Extentions"
              err.statusCode = 418
            }
         }
       }

       if ( typeof err.response.data == 'undefined' ){
         err.response.data = { // cheeky shim
           name: err.name,
           statusCode: 418,
           message: err.message 
         } 
      }


      if ( err.response.data.statusCode == 401 ){
        console.log("axios.default.auth.err:", err )
        console.log("axios.default.auth.resp.data: ", err.response.data )
        return Promise.reject({ clientError: err.response.data })
      }

      
       return Promise.reject({ clientError: err.response.data })

     }
   ),
   

  fetch: async function ( url, data = {}, opts = {} ){

    var authBasic = {}
     // console.assert( opts.auth == 'basic' )
     if ( opts.auth == 'basic' ) {
       authBasic = {
         username: sessionStorage.getItem('auth.username'),
         password: sessionStorage.getItem('auth.password')
       }
     }

     if ( opts.accessToken !== undefined ) {
       this.client.config.assign(
         {
           headers: { 'authorization': opts.accessToken }
         }
       )
       console.log("fetch.config: ", this.client.config)
     }

    return this.client({
      url: url,
      auth: authBasic,
      data: data
    })

  }
}

export { apiClient }
