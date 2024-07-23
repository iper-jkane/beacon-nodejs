<script setup>

  import { ref, defineProps } from 'vue'

  const props = defineProps({
    colArr: {
      type: Array,
      default: new Array( '#84bcc9', '#b5472f', '#e6cd56', '#a3bd31' )
    },
    tehString: String
  })

  const applyCssToString = function(){

    const skipChars = " "
    const tehString = props.tehString
    const colArr = props.colArr
    const numColors = colArr.length 
   
    var retHtml = "" 
    var j = 0
    for( var i = 0; i < tehString.length; i++ ){ 
      const c = tehString.charAt(i)
      if( ! skipChars.includes(c) ){ 
        retHtml += `<span style="color: ${colArr[j++ % numColors]};">${c}</span>`
      }else{
        retHtml += c
      }
    } 
  
    return retHtml  
  }

</script>

<template>
  <span v-html="applyCssToString()"></span>
</template>
