<script setup>

  import JsonEditor from 'json-editor-vue'
	// import { beaconInfoResponseSchema } from '../../../../schema/mongoose/beacon/framework/responses/beaconInfoResponse.js'
  // eslint-disable-next-line
  import { ref } from 'vue'
  import { schemaToProps } from '../composables/schema/mongoose/utils.js'
  import { axiosWrapper } from '@/composables/api/apiClient.js'

  axiosWrapper.__addFilter(/info/)
  async function fetchBeaconInfo(retry){

        if( retry ){
          axiosWrapper.__removeFilter(/info/)
        }

        return await axiosWrapper({
          //url: 'http://localhost:9001/info'
          url: 'https://10.128.0.3:9001/info'
        })
        .then( (resp) => { console.log(resp.data); return resp.data } )
        .catch( (err) => { console.log(err); return { } } )

  }
 
  const beaconInfoResponse = ref( await fetchBeaconInfo() )
  // // eslint-disable-next-line
  // const props = defineProps(
  //   schemaToProps(beaconInfoResponseSchema)
  // )

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

