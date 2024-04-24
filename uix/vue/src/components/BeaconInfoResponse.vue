<script setup>

  import JsonEditor from 'json-editor-vue'
	// import { beaconInfoResponseSchema } from '../../../../schema/mongoose/beacon/framework/responses/beaconInfoResponse.js'
  // eslint-disable-next-line
  import { ref, inject } from 'vue'
  import { schemaToProps } from '../composables/schema/mongoose/utils.js'

  const apiClient = inject('apiClient')

  const beaconInfoResponse = ref("Fetching The Info Now...(that's a smashing blouse, btw!)")
  beaconInfoResponse.value  = await apiClient.fetch( '/info', {}, { auth: 'basic' } ).then(
    (resp) => { return apiClient.parseResponse( resp ) } ).catch( (err) => { return apiClient.parseError(err) } )

</script>

<style>
  .horiz {
    display: flex;
  }

  div,pre { color: #42b983; }
  @import '../assets/jse-theme-dark.css'
</style>

<template>
<div class="horiz">
<div>
  <JsonEditor class="jse-theme-dark" v-model="beaconInfoResponse" />
</div>
<div>
<pre>
{{ beaconInfoResponse }}
</pre>
</div>
</div>
</template>

