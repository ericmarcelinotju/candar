<template>
  <div class="workspace">
    <div class="flex flex-col p-6 bg-white shadow rounded-md">
      <template v-if="title">
        <div class="-mt-4 mb-2 text-info font-bold capitalize">
          {{ title }}
        </div>
        <hr class="-mx-6 mb-2">
      </template>

      <div class="flex justify-between pt-2">
        <div v-if="$slots.action">
          <div class="flex justify-center">
            <slot name="action" />
          </div>
        </div>
        <div v-if="$slots.search && $slots.action">
          <slot name="search" />
        </div>
      </div>
      <slot />
      <slot name="dialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
