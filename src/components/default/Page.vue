<template>
  <div class="workspace">
    <div class="flex flex-col p-6">
      <div class="flex justify-between items-center">
        <div v-if="title">
          <div class="mb-2 text-xl font-bold capitalize">
            {{ title }}
          </div>
          <BreadCrumb />
        </div>
        <div v-if="$slots.action">
          <div class="flex justify-center">
            <slot name="action" />
          </div>
        </div>
      </div>

      <div class="mt-6 border border-neutral-50 rounded-lg p-6">
        <div v-if="$slots.search && $slots.action">
          <slot name="search" />
        </div>

        <slot />
      </div>
      <slot name="dialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumb from './BreadCrumb.vue'

defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
