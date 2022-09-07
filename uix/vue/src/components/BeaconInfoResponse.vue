<script setup>

	// import { beaconInfoResponseSchema } from '../../../../schema/mongoose/beacon/framework/responses/beaconInfoResponse.js'
  // eslint-disable-next-line
  import { schemaToProps } from '../composables/schema/mongoose/utils.js'
  import { axiosWrapper } from '@/composables/api/apiClient.js'

  axiosWrapper.__addFilter(/info/)
  async function fetchBeaconInfo(retry){

        if( retry ){
          axiosWrapper.__removeFilter(/info/)
        }

        return await axiosWrapper({
          url: 'http://localhost:9001/info'
        })
        .then( (resp) => { console.log(resp.data); return resp.data } )
        .catch( (err) => { console.log(err); return { } } )

  }
 
  const beaconInfoResponse = await fetchBeaconInfo()
  // // eslint-disable-next-line
  // const props = defineProps(
  //   schemaToProps(beaconInfoResponseSchema)
  // )

</script>

<style>
  div,pre { color: #42b983; }
</style>

<template>
<pre>
  {{ beaconInfoResponse }}
</pre>
</template>
