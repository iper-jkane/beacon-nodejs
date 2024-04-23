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
  fetch: async function ( url, data, opts ){

    var authBasic = {}

    if ( opts.auth == 'basic' ) {
      authBasic = {
        username: sessionStorage.getItem('auth.username'),
        password: sessionStorage.getItem('auth.password')
      }
    }

    if ( opts.bearer !== undefined ) {
      this.client.config.assign(
        {
          headers: { 'authorization': opts.bearer }
        }
      )
    }

    return await this.client({
      url: url,
      auth: authBasic,
      data: data
    }).then( (resp) => {
         console.log("axios.resp: ", resp )
         return resp.data ?? { apiWeirdness: "see console" }
    }).catch( (err) => { 
       console.log("axios.err:", err )
       if ( err.response ){
         return err.response.data ?? { apiClientError: "'Bad' bad; not good." }
       }
    })

  }
}

export { apiClient }
