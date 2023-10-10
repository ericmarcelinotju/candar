<template>
  <div class="group relative">
    <slot />

    <div class="absolute hidden group-hover:block top-full left-2 bg-grey-dark z-50 px-3 py-1 rounded-md">
      <p class="font-semibold text-xs text-white whitespace-nowrap">
        {{ info }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  info: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
