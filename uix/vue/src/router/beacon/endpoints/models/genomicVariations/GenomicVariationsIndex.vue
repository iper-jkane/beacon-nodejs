<script setup>

  import { defineProps, ref, reactive, provide, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const apiClient = inject('apiClient')

  const gVars = ref("Nothing Yet...") 
  provide( 'genomicVariations', gVars )

  // import Joi ??
  const query = reactive({ requestParameters: {} })
  
  query.requestParameters.limit = 2
  
// fetch endpoint parameters from server rather than hardcoding enums and the like...
// and / or use the mongoose "middleware"

// fetch the g_variants on demand
const fetchGVars = async function() { 
  gVars.value = await apiClient.fetch('/g_variants', { query: query }, { auth: 'basic' })
}

</script>

<style>

</style>

<template>
<pre>
  <input v-model="query.requestParameters.limit" placeholder="limit..." /><br/>
  <button type="button" @click="fetchGVars()">Fetch/Refresh</button>

  {{ gVars }}
</pre>
</template>
