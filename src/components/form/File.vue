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
        <template v-if="fileExist">
          <DocumentIcon class="text-gray-600 w-6 h-6" />
          <span class="font-medium text-gray-600">
            <p class="leading-7">
              Uploaded <b>{{ (modelValue as File).name }}</b>, or
              <span class="text-blue-600 underline">change</span>
            </p>
            <span
              v-if="info"
              class="font-normal w-full text-sm"
            >
              {{ info }}
            </span>
          </span>
        </template>
        <template v-else>
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
        </template>

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
import { CloudUploadIcon, DocumentIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'

interface Props {
  id?: string
  name?: string
  label?: string
  accept?: string
  info?: string
  modelValue?: File | string
}

const props = defineProps<Props>()

const emit = defineEmits(['change', 'update:modelValue'])

const onFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return

  emit('update:modelValue', files[0])
  emit('change', files[0])
}

const fileExist = computed(() => props.modelValue && props.modelValue instanceof File)
</script>
