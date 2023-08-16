<template>
  <div class="workspace">
    <div class="flex flex-col p-6 bg-white shadow rounded-md">
      <template v-if="title">
        <div class="-mt-4 mb-2 text-info font-bold capitalize">
          {{ title }}
        </div>
        <hr class="-mx-6 mb-2">
      </template>
      <div
        v-if="$slots.search"
        class="mt-2"
      >
        <slot name="search" />
      </div>
      <div
        v-if="$slots.search && $slots.action"
        class="mt-4"
      />
      <div
        v-if="$slots.action"
        class="flex justify-between"
      >
        <div class="flex justify-center">
          <slot name="action" />
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
