<script setup>
  import { ref, unref } from 'vue'
  import { axiosWrapper } from '@/composables/api/apiClient.js'

  const authData = ref({
    username: "",
    password: "",
    // isAuthenticated: false
  })

  const authResp = ref()

  const requestAuth = function(){
    console.log(authData)

    const authDataUnref = unref(authData)
    sessionStorage.setItem('auth.username', authDataUnref.username)
    sessionStorage.setItem('auth.password', authDataUnref.password)

    const axiosReq = axiosWrapper({
      url: '/auth/login',
      auth: authDataUnref
    }).then( (r) => { 

           console.log("resp: ", r); 
           authResp.value = r.data ? "Login Successful" : "OtherWeirdness";
           sessionStorage.setItem( 'jwt', JSON.stringify(r.data) )

      }).catch( (e) => { 
           console.log("error: ", e); authResp.value = e.response.data.message 
        })

      return axiosReq
  }

</script>

<style>
  #AuthLogin {
    position: absolute;
    text-overflow: ellipsis;
    max-width: 350px;
    min-width: 35px;
    border: 1px solid #ce8e60; /*#b97342;*/
    background: #0f0f0f;
    padding: 22px 32px;
    overflow: clip;
  }
</style>

<template>
<div id="AuthLogin">
  {{ authResp }}
  <form>
    <input v-model="authData.username" placeholder="username" /><br/>
    <input v-model="authData.password" placeholder="password" type="password"/>
    <button type="button" @click="requestAuth">Login</button>
  </form>
</div>
</template>

