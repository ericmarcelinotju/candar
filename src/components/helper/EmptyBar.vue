<template>
  <div :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '30px'
  },
  display: {
    type: String,
    default: 'inline-block'
  },
  margin: {
    type: String,
    default: '0'
  },
  shape: {
    type: String,
    default: 'box'
  }
})

const borderRadius = computed(() => {
  const defaultBorderRadius = '16px'
  if (props.shape === 'circle') return '50px'
  return defaultBorderRadius
})

const style = computed(() => {
  const result = {
    width: props.width,
    height: props.height,
    display: props.display,
    borderRadius: borderRadius.value,
    margin: undefined
  }
  if (props.margin !== '0') {
    result.margin = props.margin
  }
  return result
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable";
@import "@/assets/scss/responsive";

div {
  border-radius: $global-radius;
  background: $gray-light-4;
  background-image: linear-gradient(to right, $gray-light-4 10%, $gray-light-3 40%, $gray-light-4 60%);
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: shimmer;
  -webkit-animation-timing-function: linear;
}

@keyframes shimmer {
  0% {
    background-position: -250px 0;
  }
  100% {
    background-position: 250px 0;
  }
}
</style>
