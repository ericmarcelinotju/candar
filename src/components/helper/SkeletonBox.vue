<template>
  <span
    class="skeletonBox"
    :style="{ height, width, backgroundColor}"
  />
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '200px'
  },
  backgroundColor: {
    type: String,
    default: '#DDDBDD'
  }
})
</script>

<style lang="scss" scoped>
.skeletonBox {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 13px;
}
</style>
