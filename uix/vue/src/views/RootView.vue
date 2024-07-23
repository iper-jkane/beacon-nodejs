<script setup>
  import colstr from '../components/ColorString.vue'

  // GreyBlue, Brick, Pale Gold, Sick Green
  const beaconColors  = [ '#ff0000', '#942682', '#ec6500' ]
  const ga4ghColors = [ '#4faedc', '#1b75bb', '#8bc53f', '#f9a533', '#e34a3b', '#9f7ab0' ]
  const egaColors  = [ '#185177', '#5e9cc3', '#eb9662', '#f6c75e' ]

  // e.g., SHOULD BE a query to /info to fetch beaconInfoResponse
  // caching would be good here also; to share with InfoView
  const beaconInfo = {
    welcomeUrl: "https://localhost:8080",
    description: "Beacon of Genomic Variations!",
    name:  "Inst-Dept Beacon",
    organization: {
      name: "Institute"
    }
  }

</script>
<style scoped>

  .center {
    text-align: center;
  }

  .subscript {
    font-size: 54%;
  }

</style>

<template>
  <div class="center">
    <p>Hello There!</p>
    <p>You have found a {{ beaconInfo.description }}</p>
    This particular instance is curated by
      <a :href="beaconInfo.welcomeUrl">
        {{ beaconInfo.organization.name }}
      </a>

    <p>Please <router-link :to="{ name: 'authLogin' }">Login</router-link> to begin.</p>
    <div class="subscript">
    Based on the
      <a href="https://www.ga4gh.org/product/beacon-api/">
       <colstr :colArr="ga4ghColors" teh-string="GA4GH"/>
      </a> Beacon (v2) Specification<br/>and
      <a href="https://github.com/EGA-archive/beacon2-ri-api">
        <colstr :colArr="egaColors" teh-string="EGA"/>
      </a> Reference Implementation.
    </div>
</div>
</template>
