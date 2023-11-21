<template>
  <div class="relative">
    <div class="-mt-3">
      <div class="mt-12 flex justify-center items-center gap-3">
        <div>
          <span class="text-lg">
            {{ priorityLabel }}
          </span>
          <span class="ml-3 font-semibold">
            {{ priority }}%
          </span>
        </div>
        <input
          id="large-range"
          v-model="priority"
          class="w-full h-2 accent-red-500 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          :class="[priorityColor]"
          max="100"
          min="0"
          type="range"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Project } from '@/typings/models/project.type'

interface Props {
  data: Project
  modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const priority = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const priorityLabel = computed(() => priority.value > 75 ? 'High' : priority.value > 49 ? 'Medium' : 'Low')
const priorityColor = computed(() => priority.value > 75 ? 'accent-red-500' : priority.value > 49 ? 'accent-yellow-500' : 'accent-blue-500')

</script>
