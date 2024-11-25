// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // host and port
  compatibilityDate: '2024-11-21',
  ssr: false,
  app: {
    head: {
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'}
      ]
    }
  },
  runtimeConfig: {
    public: {
      SOCKET_SERVER_URL: 'http://192.168.50.183:5000', // Replace with your server URL
    },
  },
  components: {
    global: true,
    dirs: ['~/components']
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
  // plugins: ['~/plugins/socket.js'],
})
