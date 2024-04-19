
// there has to be a better way :D
// presumably using webpack DefinePlugin to allow passing env vars not prefixed by 'VUE_APP_'
if ( process.env.VUE_APP_BNJS_PROTO === undefined ) {
  process.env.VUE_APP_BNJS_PROTO = process.env.BNJS_PROTO ? process.env.BNJS_PROTO : 'https'
}
if ( process.env.VUE_APP_BNJS_HOST === undefined ) {
  process.env.VUE_APP_BNJS_HOST = process.env.BNJS_HOST ? process.env.BNJS_HOST : 'localhost'
}
if ( process.env.VUE_APP_BNJS_PORT === undefined ) {
  process.env.VUE_APP_BNJS_PORT = process.env.BNJS_PORT ? process.env.BNJS_PORT : 8080
}

const beaconHost = process.env.VUE_APP_BNJS_HOST

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // publicPath: '/api/',
  transpileDependencies: true,
  devServer: {
      host: `${beaconHost}`, 
      client: {
          webSocketURL: `wss://${beaconHost}/ws`,
      },
       allowedHosts: [ 'localhost', beaconHost ]
  },
})
