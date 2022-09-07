<script setup>

	import { beaconInfoResults } from '../../../../schema/mongoose/beacon/framework/responses/sections/beaconInfoResults.js'
  import { schemaToProps } from '../composables/schema/mongoose/utils.js'

  /* required beacause id is reserved in vue */
  const propBeaconId = { 
    bid: { 
      type:    beaconInfoResults.path('id').options.type,
      default: beaconInfoResults.path('id').options.default 
    } 
  }

  beaconInfoResults.add(propBeaconId)
  beaconInfoResults.remove('id')

  // eslint-disable-next-line
  const props = defineProps(
    schemaToProps(beaconInfoResults)
  )

</script>

<style>

</style>

<template>
<pre>
  {{ props }}
</pre>
</template>
