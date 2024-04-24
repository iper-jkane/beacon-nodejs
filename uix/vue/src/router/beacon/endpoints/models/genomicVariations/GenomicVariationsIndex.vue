<script setup>

  // The definition of MVP...

  import { ref, reactive, inject } from 'vue'

  const apiClient = inject('apiClient')

  const apiResp = ref("Wouldn't you prefer a good game of chess?")

  const defGran = 'boolean'

  const fetchLocalAllowedGranularities = function() {
    const parsedGrans = JSON.parse( sessionStorage.getItem('beaconConfig.allowedGranularities') )
    if ( parsedGrans !== null ) {
      return parsedGrans
    } else {
      return [ defGran ]
    }
  }

  const reqGranularity = ref(defGran)
  const retGranularity = ref(defGran)
  const reqGrans = ref([defGran])

  var feedback = ref("(for science!)")
  var haveError = ref(false)

  const query = reactive({ requestParameters: {} })
  query.requestParameters.limit = 100

  const g_variants = ref({})

// fetch the g_variants on demand
const fetchGVars = async function() {
  feedback.value = "(fetching)"
  query.requestedGranularity = reqGranularity.value
  apiResp.value = await apiClient.fetch('/g_variants', { query: query }, { auth: 'basic' }).then(

    (resp) => {
      haveError.value = false
      feedback.value = "(answered)"
      const parsedResp = apiClient.parseResponse(resp)
      retGranularity.value = resp.data.meta.returnedGranularity

      // g_variants.value = parsedResp.responseSummary ?? parsedResp.response.resultSets[0].results

      //  better to use a configurationMap returned from api: granularity -> resp.data.path.to.field map
      //  maybe some possible vue logic; use switch for now...
      switch(  resp.data.meta.returnedGranularity ) {
        case 'boolean':
        case 'count':
          g_variants.value = parsedResp.responseSummary
          return g_variants.value
        case 'record':
          g_variants.value = parsedResp.response.resultSets[0].results
          return `ResultSet: ${parsedResp.response.resultSets[0].id}`
      }

    }).catch(

      (err) => {
        feedback.value = "(oh no!)"
        haveError.value = true
        return apiClient.parseError(err)
    })

}


</script>

<style>

table, th {
  border: 1px dotted;
  border-collapse: collapse;
}

tr {
  color: #338f65;
}

tr:nth-child(even) {
    color: #338f65;
    /* background-color: #101417; */
    background-color: #101417;
}

td {
  border-right: 1px dotted;
}

.records {
    display: flex;
    text-align: left;
}
</style>


<template>
<div>
<pre>
  Variation Search {{ feedback }}<br/>
  <select @click="reqGrans=fetchLocalAllowedGranularities()" v-model="reqGranularity">
    <option v-for="gran in reqGrans" :key="gran">{{ gran }}</option>
  </select> <input v-model="query.requestParameters.limit" placeholder="limit..." />
  <button type="button" @click="fetchGVars()">Fetch/Refresh</button>

<div v-if="apiResp">{{ apiResp }}</div>
</pre>
<div v-if="retGranularity=='record' && g_variants.length > 0" class="records">
<table>
  <tr><th>Row</th><th>SequenceId</th></tr>
  <tr v-for="(variant, ind) in g_variants" :key="variant.variantInternalId">
    <td>{{ ind }}</td><td>{{ variant.variation.location.sequence_id }}</td>
  </tr>
</table>
</div>
<div v-else>
<pre v-if="g_variants.length > 0">
{{ g_variants }}
</pre>
</div>
</div>
</template>
