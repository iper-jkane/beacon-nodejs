<script setup>
  import { ref, unref, inject } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const apiClient = inject('apiClient')
   
  const clientAuthData = ref({
    username: "",
    password: "",
    // isAuthenticated: false
  })

  const authResp = ref()
  const authMsg = ref("AuthBox")
  const hasAuth = ref(false)

  /* const requestAuth = () => {} */
  const requestAuth = async function(){

    const clientAuthDataUnref = unref(clientAuthData)
    sessionStorage.setItem('auth.username', clientAuthDataUnref.username)
    sessionStorage.setItem('auth.password', clientAuthDataUnref.password)

    const authResp = await apiClient.fetch('/auth/login', {}, { auth: 'basic' } ).then(
      (resp) => {

        const parsedResp = apiClient.parseResponse(resp)
          if ( parsedResp.authResponse ){
            sessionStorage.setItem('auth.creds', JSON.stringify( parsedResp.authResponse ) )
            sessionStorage.setItem('auth.jwt', parsedResp.authResponse.jwt)
            sessionStorage.setItem('beaconConfig.allowedGranularities', JSON.stringify( parsedResp.authResponse.authZData.beaconConfig.allowedGranularities ) )
            authMsg.value = parsedResp.authResponse.msg + ' (redirecting...)'
            // probs switch to vue transitions 
            setTimeout( () => { 
              hasAuth.value = true
              router.push( { name: 'GenomicVariationsRoute'} ) 
            }, 1000 )
            return parsedResp.authResponse
          }
      }).catch(
        (err) => { 
          authMsg.value = apiClient.parseError(err) //, { messageOnly:false })
          return authMsg.value 
     })

/* authResp.value = r.data ? "Login Successful" : "OtherWeirdness"; */
}

</script>

<style>
  #AuthLogin {
    position: absolute;
    text-overflow: ellipsis;
    max-width: 350px;
    min-width: 35px;
    border: 3px solid #ce8e60; /*#b97342;*/
    background: #0f0f0f;
    padding: 22px 32px;
    overflow: clip;
  }

</style>

<template>
<div v-if="!hasAuth">
<div id="AuthLogin">
  {{ authMsg }}
  <form>
    <input v-model="clientAuthData.username" placeholder="username" /><br/>
    <input v-model="clientAuthData.password" placeholder="password" type="password"/>
    <button type="button" @click="requestAuth">Login</button>
  </form>
</div>
</div>
</template>

