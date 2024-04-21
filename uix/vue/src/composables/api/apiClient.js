import axios from 'axios'
import axiosCache from 'axios-cache-plugin'

console.log( "VUE_APP_BNJS_UIX_URL: ", process.env.VUE_APP_BNJS_UIX_URL )
console.log( "VUE_APP_BNJS_API_URL: ", process.env.VUE_APP_BNJS_API_URL )

const beaconApiUrl   = new URL( process.env.VUE_APP_BNJS_API_URL )
console.log("beaconApiUrl: ", beaconApiUrl)

const beaconApiHost  = beaconApiUrl.hostname
const beaconApiPort  = beaconApiUrl.port
const beaconApiProto = beaconApiUrl.protocol.slice(0,-1)

let axiosClient = axios.create({
  withCredentials: false,
  method: 'post',
  baseURL: `${beaconApiProto}://${beaconApiHost}:${beaconApiPort}`
})

// axiosClient.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request, null, 2))
//   return request
// })

let axiosWrapper = axiosCache(axiosClient, {
  maxCacheSize: 15,
  ttl: 30000
})


export { axiosWrapper }
