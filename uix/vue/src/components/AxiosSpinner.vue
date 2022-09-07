<script setup>
 // https://cssloaders.github.io/ 
 // look how neat the css code is!! :D 
</script>

<template>
    <div class="loader"></div>
</template>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 10px solid;
  border-color: 
		rgba(81, 102, 113, 0.15)
		rgba(81, 102, 113, 0.25)
		rgba(81, 102, 113, 0.35)
		rgba(81, 102, 113, 0.50);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>
