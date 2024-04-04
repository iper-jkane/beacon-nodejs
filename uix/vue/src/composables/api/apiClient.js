import axios from 'axios'
import axiosCache from 'axios-cache-plugin'

let axiosClient = axios.create({
  withCredentials: false,
  method: 'post',
  baseURL: 'https://localhost:9001'
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
