<script setup>
  // import { ref } from 'vue'

  const beaconModels = [
    { id: "Analysis" },
    { id: "Biosample" },
    { id: "Cohort" },
    { id: "Dataset" },
    { id: "GenomicVariant" },
    { id: "Individual" },
    { id: "Models" },
    { id: "Run" },
  ]

</script>

<style scoped>
  .listHolder {
    padding-left: 3vw;
  }
</style>

<template>
  <div class="listHolder">
    <li v-for="model in beaconModels" v-bind:key="model.id">
          <router-link to="/g_variants">Genomic Variations</router-link> 

    </li>
  </div>
</template>
