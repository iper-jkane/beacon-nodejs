import axios from 'axios'
import axiosCache from 'axios-cache-plugin'

const beaconProto = process.env.VUE_APP_BNJS_PROTO  ? process.env.VUE_APP_BNJS_PROTO : 'https'
const beaconHost  = process.env.VUE_APP_BNJS_HOST   ? process.env.VUE_APP_BNJS_HOST  : 'localhost'
const beaconPort  = process.env.VUE_APP_BNJS_PORT   ? process.env.VUE_APP_BNJS_PORT  : 9001

let axiosClient = axios.create({
  withCredentials: false,
  method: 'post',
  baseURL: `${beaconProto}://${beaconHost}:${beaconPort}`
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
