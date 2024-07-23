<script setup>

  import JsonEditor from 'json-editor-vue'
	// import { beaconInfoResponseSchema } from '../../../../schema/mongoose/beacon/framework/responses/beaconInfoResponse.js'
  // eslint-disable-next-line
  import { ref, inject, defineProps } from 'vue'
  import { schemaToProps } from '../composables/schema/mongoose/utils.js'

  const apiClient = inject('apiClient')

  const props = defineProps({
    debug: {
      type: Boolean,
      default: false
    }
  })

  const beaconInfoResponse = ref("Fetching The Info Now...(that's a smashing blouse, btw!)")
  // probably check state / store
  beaconInfoResponse.value  = await apiClient.fetch('/info').then(

    (resp) => {
      const pResp = apiClient.parseResponse( resp )
      // maybe some logic here...
      return pResp
    }

  ).catch(

    (err) => {
      return apiClient.parseError(err)
    }

  )

</script>

<style scoped>

  .horiz {
    display: flex;
  }

  @import '../assets/jse-theme-dark.css'

</style>

<template>
<div class="horiz">
<div v-if="debug">
  <JsonEditor class="jse-theme-dark" v-model="beaconInfoResponse" />
</div>
<div>
<pre>
{{ beaconInfoResponse }}
</pre>
</div>
</div>
</template>

