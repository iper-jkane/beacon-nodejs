<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { ref, slots } from 'vue';

const colors = ref([]);

function colorize() {
  const inputString = slots.default();
  var outputString = '';

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i];
    const color = colors.value[i % colors.value.length];

    outputString += `<span style="color: ${color};">${char}</span>`;
  }

  return outputString;
}
</script>


