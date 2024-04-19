const beaconHost       = process.env.VUE_APP_BJNS_HOST ? process.env.VUE_APP_BJNS_HOST  : 'localhost'

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/api/',
  transpileDependencies: true,
  devServer: {
      host: `${beaconHost}`, 
      client: {
          webSocketURL: `wss://${beaconHost}/ws`,
      },
       allowedHosts: [ 'localhost', beaconHost ]
  },
})
