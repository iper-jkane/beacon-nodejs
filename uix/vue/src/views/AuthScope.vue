<script setup>
  import { ref, unref, inject } from 'vue'

  const apiClient = inject('apiClient')
  const scopeResp = ref()

  const defMsg = "You must login to receive a valid token!"
  const userMsg = ref(defMsg)
  const bearer = ref(defMsg)

const fetchLocalToken = function() {
  const localJwt = sessionStorage.getItem('auth.jwt') 
  if ( localJwt !== null ){
    bearer.value = localJwt 
    return true
  }

  userMsg.value = "I really must insist that you login!"
  return false
}

const clearSessionStorage = function(){
  bearer.value = null 
  scopeResp.value = null
  userMsg.value = defMsg
  sessionStorage.clear()
}

const requestScope = async function() {
console.log(bearer.value, userMsg.value  )
  if( bearer.value != userMsg.value && bearer.value !== null ) {

    scopeResp.value = await apiClient.fetch('/auth/scope', {}, { accessToken: bearer.value } ).then( 
      (resp) => { 
        return apiClient.parseResponse(resp)  
     }).catch( 
      (err) => { 
        return apiClient.parseError(err) 
     })
  }
}

</script>

<style>

</style>

<template>
<!-- <div v-if="scopeResp.headers.isAuthenticated !== undefined"> -->
<!-- <div v-if="!scopeResp"> -->

  <form>
    <textarea v-model="bearer" :placeholder="userMsg" type="text" rows="6" cols="55"> 
    </textarea><br/>
    <button type="button" @click="fetchLocalToken">Fetch Local JWT</button> |
    <button type="button" @click="requestScope">Authorize</button> |
    <button type="button" @click="clearSessionStorage">ClearSessionStorage</button>
  </form><br />
  <div>
    {{ scopeResp }}
  </div>

<!-- </div> -->
<!-- <div v-else> -->
<!--   <br /> -->
<!--   <button type="button" @click="requestScope">Authorize</button> -->
<!--   <button type="button" @click="clearSessionStorage()">ClearSessionStorage</button> -->
<!-- </div> -->
</template>
