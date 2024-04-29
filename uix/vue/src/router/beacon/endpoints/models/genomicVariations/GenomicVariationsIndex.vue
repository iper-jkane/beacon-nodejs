<script setup>

  // The definition of MVP...
  import { ref, reactive, inject } from 'vue'

  import * as _ from 'lodash'

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

  // fields are hardcoded to LegacyVariation; for now
  // as are the labels
  const gVarLegacyHeaders = [
          { itemPivot: 'variation.variantType',                   label: 'varType'  },
          { itemPivot: 'variation.location.interval.start.value', label: 'seqStart' },
          { itemPivot: 'variation.location.interval.end.value',   label: 'seqEnd'   },
          { itemPivot: 'variation.referenceBases',                label: 'refBase'  },
          { itemPivot: 'variation.alternateBases',                label: 'altBase'  },
          { itemPivot: 'variation.location.sequence_id',          label: 'seqId'    },
        ]


  const gVarHeaders = ref([])
  const g_variants = ref([])


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
          gVarHeaders.value = [ { itemPivot: "exists", label: "Exists" } ] 
          g_variants.value = [ parsedResp.responseSummary ]
          return "Existential Query!"
        case 'count':
          gVarHeaders.value = [ { itemPivot: "numTotalResults", label: "Count" } ]   
          g_variants.value = [ parsedResp.responseSummary ]
          return "Cardenal Query!"
        case 'record':
          // type == LegacyVariation
         gVarHeaders.value = gVarLegacyHeaders
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
<pre>
  Variation Search {{ feedback }}<br/>
  HGVS-Id: <input @click="hgvsId='NC_000022.11:g.16054454C>T'" v-model="hgvsId" placeholder="e.g., NC_000022.11:g.16054454C>T"/>
  <select @click="reqGrans=fetchLocalAllowedGranularities()" v-model="reqGranularity">
    <option v-for="gran in reqGrans" :key="gran">{{ gran }}</option>
  </select><span v-if="reqGranularity=='record' && !hgvsId" > Limit: <input id="lim" v-model="query.requestParameters.limit" placeholder="limit..." /></span>
  <button type="button" @click="fetchGVars()">Fetch/Refresh</button>

<div v-if="apiResp">{{ apiResp }}</div>
</pre>
<div>
 <table>
  <thead v-if="gVarHeaders.length > 0">
   <tr>
    <th v-for="( hI ) of gVarHeaders" :key="hI.itemPivot">{{ hI.label }}</th>
   </tr>
  </thead>
  <tbody v-if="gVarHeaders.length > 0 && g_variants.length > 0">
   <tr v-for="( gV ) of g_variants" :key="gV">
    <td v-for="( hI ) of gVarHeaders" :key="hI.itemPivot">
      {{ _.get( gV, hI.itemPivot, "N/A" ) }}
    </td>
   </tr>
  </tbody>
 </table>
</div>
</template>

