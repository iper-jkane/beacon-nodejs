<script setup>
  import AxiosSpinner from '@/components/AxiosSpinner.vue'
</script>

<template>
  <nav>
    <router-link to="/">BeaconRoot</router-link> |
    <router-link to="/info">BeaconInfo</router-link> |
    <router-link to="/models">Models</router-link>
  </nav>

<Suspense>
  <template #default>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </template>
  <template #fallback>
    <AxiosSpinner />
  </template>
</Suspense>

</template>

<style>

  body { 
    background-color: #0f0f0f; 
    color: #f0f0ff;
  }
 
div {
    color: #2c3e50;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
/*  text-align: center; */
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
