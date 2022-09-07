const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/api/',
  transpileDependencies: true,
  devServer: {
      client: {
          webSocketURL: 'wss://localhost/ws',
      },
       allowedHosts: 'localhost',
  },
})
