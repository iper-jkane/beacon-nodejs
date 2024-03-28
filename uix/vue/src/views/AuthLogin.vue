<script setup>
  import { ref, unref } from 'vue'
  import { axiosWrapper } from '@/composables/api/apiClient.js'

  const authData = ref({
    username: "",
    password: "",
    // isAuthenticated: false
  })

  const authResp = ref({ isAuthenticated: false, credentials: {} })

  const requestAuth = function(){
    console.log(authData)
    const axiosReq = axiosWrapper({
      url: 'https://localhost:9001/auth/login',
      auth: unref(authData)
    }).then( (r) => { console.log("resp: ", r); authResp.value = r.data } ).catch( (e) => { console.log("error: ", e); authResp.value = e.message })
    return axiosReq
  }

</script>

<style>
</style>

<template>
  {{ authData }}<br/>
  {{ authResp }}
  <p>Login:</p>
  <form>
    <input v-model="authData.username" placeholder="username" /><br/>
    <input v-model="authData.password" placeholder="password" />
    <button @click="requestAuth">Login</button>
  </form>
</template>

