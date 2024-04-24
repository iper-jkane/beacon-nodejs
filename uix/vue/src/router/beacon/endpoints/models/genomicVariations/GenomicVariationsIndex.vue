<script setup>

  import { defineProps, ref, reactive, provide, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const apiClient = inject('apiClient')

  const gVars = ref("Nothing Yet...") 
  provide( 'genomicVariations', gVars )

  var feedback = ref("")
  const query = reactive({ requestParameters: {} })
  
  query.requestParameters.limit = 2
  
// fetch endpoint parameters from server rather than hardcoding enums and the like...
// and / or use the mongoose "middleware"

// fetch the g_variants on demand
const fetchGVars = async function() { 
  feedback.value = "fetching" 
  gVars.value = await apiClient.fetch('/g_variants', { query: query }, { auth: 'basic' } 
  ).then( 
    (resp) => { 
      const parsedResp = apiClient.parseResponse(resp) 
      feedback.value = ""
      return parsedResp

    }).catch( 
      (err) => { return apiClient.parseError(err)  }
    )
}

</script>

<style>

</style>

<template>
<pre>
<div>
  Variation Search {{ feedback }}
  <input v-model="query.requestParameters.limit" placeholder="limit..." /><br/>
  <button type="button" @click="fetchGVars()">Fetch/Refresh</button>

  {{ gVars }}
</div>
</pre>
</template>
