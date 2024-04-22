<script setup>
  import { defineProps, ref, provide, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const apiClient = inject('apiClient')

  const gVars = ref({}) 
  provide( 'genomicVariations', gVars )

  
</script>

<style>

</style>

<template>
<pre>
  {{ apiClient }}
  <!-- {{ useRoute() }} -->
  {{ props }}
</pre>
</template>
