<script setup>
  import { ref, unref, inject } from 'vue'

  const apiClient = inject('apiClient')
   
  const authData = ref({
    username: "",
    password: "",
    // isAuthenticated: false
  })

  const authResp = ref()
  const authMsg = ref("AuthBox")
  const hasAuth = ref(false)

  /* const requestAuth = () => {} */
  const requestAuth = async function(){
    console.log(authData)

    const authDataUnref = unref(authData)
    sessionStorage.setItem('auth.username', authDataUnref.username)
    sessionStorage.setItem('auth.password', authDataUnref.password)

    // disable apiClient default response/error handling
//    apiClient.client.interceptors.response.eject(apiClient.defaultInterceptor)
    // set response/error handling for this endpoint....
    const authInterceptor = apiClient.client.interceptors.response.use(
      (resp) => {
        console.log( "Mig-29 Fulcrum: ", resp )
        if ( resp.status == 200 ){ 
          if ( resp.authResponse ){
            hasAuth.value = true
            sessionStorage.setItem('auth.creds', JSON.stringify(resp.authResponse))
            sessionStorage.setItem('auth.jwt', resp.authResponse.jwt)
            // console.log(JSON.parse(sessionStorage.getItem('auth.creds')))
            authMsg.value = resp.authResponse.msg
            router.push({ name: 'GenomicVariationsRoute'})
            return resp.authResponse
          }
        }
      },        

      (err) => { 
        console.log("ShotDown: ", apiClient.parseErrorMsg(err) )
        authMsg.value = apiClient.parseErrorMsg(err)
        return Promise.resolve(apiClient.parseErrorMsg(err))
      }
    )
    
    authResp.value = await apiClient.fetch( '/auth/login', {}, { auth: 'basic' } )
    apiClient.client.interceptors.response.eject(authInterceptor)


// .then( 
//       (resp) => { return "foo" } 
//     ).catch( (err) => { return "nah"  } )

// .catch( 
//       (err)  => {

//         if (err.name == "AxiosError" ) { return "CLIENT ERROR" }
//         console.log("error: ", err)
//         return err.response.data ?? err

//       }
//     )
/* authResp.value = r.data ? "Login Successful" : "OtherWeirdness"; */
/* sessionStorage.setItem( 'jwt', JSON.stringify(r.data) ) */
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
<div v-if="!hasAuth">
<div id="AuthLogin">
  {{ authMsg }}
  <form>
    <input v-model="authData.username" placeholder="username" /><br/>
    <input v-model="authData.password" placeholder="password" type="password"/>
    <button type="button" @click="requestAuth">Login</button>
  </form>
</div>
</div>
</template>

