<script setup>
  import { ref, unref } from 'vue'
  import { axiosWrapper } from '@/composables/api/apiClient.js'

  const localJwt = sessionStorage.getItem('jwt') ? JSON.parse(sessionStorage.getItem('jwt')) : { access_token: "", token_type: "" }
  const bearer = ref("")
  bearer.value = `${localJwt.token_type} ${localJwt.access_token}`
  console.log(bearer.value)

  const scopeResp = ref({})
  const requestError = ref(false) // assume the best -- positive frontend devops attitude!

  const requestScope = async function(){
    const axiosReq = axiosWrapper({
      url: '/auth/scope',
      headers: { 'authorization': bearer.value }
    }).then(  (r) => { scopeResp.value = r.data, console.log("scopeResp.value: ", r) } )
      .catch( (e) => { scopeResp.value = e.response.data.error + ": " + e.response.data.message; requestError.value = true; console.log("e: ", e) })
    return axiosReq
  }

const clearSessionStorage = function(){
  bearer.value = ""
  sessionStorage.clear()
}


</script>

<style>

</style>

<template>
<!-- <div v-if="scopeResp.headers.isAuthenticated !== undefined"> -->
<div v-if="! scopeResp.rap">
  <form>
    <textarea v-model="bearer" :placeholder="bearer.value" type="text" rows="6" cols="60" />
    <br />
    <button type="button" @click="requestScope">Authorize</button> |
    <button type="button" @click="clearSessionStorage">ClearSessionStorage</button>
  </form><br />

  <div v-if="requestError">
    {{ scopeResp }}
  </div>

</div>
<div v-else>
  <br />
  {{scopeResp}}
  <button type="button" @click="requestScope">Authorize</button>
  <button type="button" @click="clearSessionStorage()">ClearSessionStorage</button>
</div>
</template>

