<script setup>
</script>

<template>
  <nav>
    <!-- <div v-if="!hasAuthed"> -->
    <!-- <div v-else> -->
    <!-- </div> -->
    <router-link :to="{ name: 'authLogin' }">Login</router-link> |
    <router-link :to="{ name: 'getBeaconRoot' }">Home</router-link> |
    <router-link :to="{ name: 'getBeaconInfoRoute' }">BeaconInfo</router-link> |
    <router-link :to="{ name: 'getBeaconModels' }">Models</router-link>
  </nav>

<Suspense>
  <router-view id="app-view">
  </router-view>
</Suspense>

</template>

<style>
  
  @font-face {
    font-family: 'montserrat';
    src: local('../assets/font-montserrat-thin.woff2') format("woff2"); 
  }

  :root {
    /* theme colors */
    --color-almost-black: #0f0f0f;
    --color-pale-grey:    #e8e8e8;
    --color-ice-blue:     #c5e3ea;

    /* INDP */
    --color-bluegrey: #b0cedc;
    --color-dark-grey-blue: #405a74;
    --color-silver: #cee1e6;
    /* GA4GH */
    --color-cool-blue : #4faedc;
    --color-bluish:     #1b75bb;
    --color-leaf:       #8bc53f;
    --color-mango:      #f9a533;
    --color-coral:      #e34a3b;
    --color-dark-lilac: #9f7ab0;
  }

  body, #app {
    background-color: var(--color-almost-black);
    color:            var(--color-pale-grey);
    font-family: 'montserrat', Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 24px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (max-width: 960px) {
    #app-view {
      max-width: 88%;
      font-size: 74%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (min-width: 960px) {
    #app-view {
      max-width: 45%;
      margin-left: auto;
      margin-right: auto;
    }
  }

nav {
  padding: 24px;
  text-align: center;
}

a {
  font-weight: bold;
  color: var(--color-dark-grey-blue);
}

a.router-link-exact-active {
  /* color: var(--color-ice-blue); */
color:            var(--color-pale-grey);
}
</style>
