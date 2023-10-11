<template>
  <div class="max-w-xl">
    <label
      class="
        flex justify-center
        w-full h-32
        px-4
        transition
        bg-white
        border-2 border-gray-300 border-dashed
        rounded-md
        appearance-none
        cursor-pointer
        hover:border-gray-400
        focus:outline-none
      "
    >
      <span class="flex flex-wrap items-center space-x-2">
        <CloudUploadIcon class="text-gray-600 w-6 h-6" />
        <span class="font-medium text-gray-600">
          <p class="leading-7">
            {{ label || 'Drop files to Attach, or' }}
            <span class="text-blue-600 underline">browse</span>
          </p>
          <span
            v-if="info"
            class="font-normal w-full text-sm"
          >
            {{ info }}
          </span>
        </span>
      </span>
      <input
        :id="id"
        :accept="accept"
        class="hidden"
        :name="name"
        type="file"
        @change="onFileChange"
      >
    </label>
  </div>
</template>

<script setup lang="ts">
import { CloudUploadIcon } from '@heroicons/vue/outline'

interface Props {
  id?: string
  name?: string
  label?: string
  accept?: string
  info?: string
}

defineProps<Props>()

const emit = defineEmits(['change'])

const onFileChange = (e) => {
  emit('change', e)
}
</script>
