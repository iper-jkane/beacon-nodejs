import axios from 'axios'
import axiosCache from 'axios-cache-plugin'
 
let axiosClient = axios.create({
  withCredentials: false,
  method: 'post',
  baseURL: 'https://localhost:9001'
})
 
let axiosWrapper = axiosCache(axiosClient, {
  maxCacheSize: 15,
  ttl: 30000 
})

export { axiosWrapper }
