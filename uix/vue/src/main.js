import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { axiosWrapper } from '../composables/api/apiClient.js'

const beaconApp = createApp(App).use(router)

// beaconApp.config.globalProperties.apiClient
beaconApp.provide( 'apiClient', axiosWrapper )
beaconApp.mount('#app')
