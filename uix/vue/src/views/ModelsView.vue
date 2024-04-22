<script setup>
  // import { ref } from 'vue'

  const beaconModels = [
    { id: "GenomicVariations" },
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
