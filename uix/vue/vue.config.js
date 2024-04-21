const url = require('node:url')

// there has to be a better way :D
// presumably using webpack DefinePlugin to allow passing env vars not prefixed by 'VUE_APP_'
if ( process.env.VUE_APP_BNJS_API_URL === undefined ) {
  process.env.VUE_APP_BNJS_API_URL = process.env.BNJS_API_URL ? process.env.BNJS_API_URL : 'https://localhost:9001'
}

if ( process.env.VUE_APP_BNJS_UIX_URL === undefined ) {
  process.env.VUE_APP_BNJS_UIX_URL = process.env.BNJS_UIX_URL ? process.env.BNJS_UIX_URL : 'https://localhost:8080'
}

console.log( "BNJS_UIX_URL: ", process.env.BNJS_UIX_URL )
console.log( "BNJS_API_URL: ", process.env.BNJS_API_URL )

const beaconUixUrl   = url.parse( process.env.VUE_APP_BNJS_UIX_URL )

const beaconUixHost  = beaconUixUrl.hostname
const beaconUixPort  = beaconUixUrl.port
const beaconUixProto = beaconUixUrl.protocol.slice(0,-1)

const beaconApiHostPort = url.parse(process.env.VUE_APP_BNJS_UIX_URL)

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // publicPath: '/api/',
  transpileDependencies: true,
  devServer: {
      server: `${beaconUixProto}`,
      host:   `${beaconUixHost}`,
      port:   `${beaconUixPort}`,
      client: {
          webSocketURL: `wss://${beaconUixHost}/ws`, // :${beaconUixPort}/ws`,
      },
       allowedHosts: [ 'localhost', beaconUixHost ]
  },

  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'false',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
})
