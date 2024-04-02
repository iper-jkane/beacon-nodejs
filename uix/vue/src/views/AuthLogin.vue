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

    const authDataUnref = unref(authData)
    sessionStorage.setItem('auth.username', authDataUnref.username)
    sessionStorage.setItem('auth.password', authDataUnref.password)

    const axiosReq = axiosWrapper({
      url: '/auth/login',
      auth: authDataUnref 
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
    <input v-model="authData.password" placeholder="password" type="password"/>
    <button type="button" @click="requestAuth">Login</button>
  </form>
</template>

