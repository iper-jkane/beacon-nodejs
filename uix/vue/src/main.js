import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { apiClient } from './composables/api/apiClient.js'

const beaconApp = createApp(App).use(router)

// beaconApp.config.globalProperties.apiClient
beaconApp.provide( 'apiClient', apiClient )
beaconApp.mount('#app')
