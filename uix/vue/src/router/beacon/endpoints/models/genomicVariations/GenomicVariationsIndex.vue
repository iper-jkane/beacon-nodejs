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
  query.requestParameters.limit = 10

  const hgvsId = ref()

  const g_variants = ref({})

// fetch the g_variants on demand
const fetchGVars = async function() {
  feedback.value = "(fetching)"
  query.requestedGranularity = reqGranularity.value
  if ( hgvsId.value && hgvsId.value != "" ){
    query.requestParameters.genomicAlleleShortForm = hgvsId.value
  }else {
    delete( query.requestParameters.genomicAlleleShortForm )
  }
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
        
        // use validation error to reset query.requestParameters.*
        // can parse the error or better, move the Joi validation to .../schema and share code
        // for now, hardcode fix...
        query.requestParameters.limit = 10
  
        return apiClient.parseError(err)

    })

}


</script>

<style scoped>

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

input {
  width: 420px;
}

input#lim { 
  max-width: 52px;
}
</style>


<template>
<!-- 
  using <pre></pre> blocks so to keep css shenanigans to a minimum for now 
  also hardcoded test code whilst "storyboarding" uix
  idea: move parameter validation to .../schema/validation/ so it can be shared between srvr and uix  
-->

<div>
<pre>
  Variation Search {{ feedback }}<br/>
  HGVS-Id: <input @click="hgvsId='NC_000022.11:g.16054454C>T'" v-model="hgvsId" placeholder="e.g., NC_000022.11:g.16054454C>T"/>
  <select @click="reqGrans=fetchLocalAllowedGranularities()" v-model="reqGranularity">
    <option v-for="gran in reqGrans" :key="gran">{{ gran }}</option>
  </select><span v-if="reqGranularity=='record' && !hgvsId" > Limit: <input id="lim" v-model="query.requestParameters.limit" placeholder="limit..." /></span>
  <button type="button" @click="fetchGVars()">Fetch/Refresh</button>

<div v-if="apiResp">{{ apiResp }}</div>
</pre>
<div v-if="retGranularity=='record' && g_variants.length > 0" class="records">
<table>
  <tr><th>Row</th><th>SequenceId</th></tr>
  <tr v-for="(variant, ind) in g_variants" :key="variant.variantInternalId">
    <td>{{ ind+1 }}</td><td>{{ variant.variation.location.sequence_id }}</td>
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
