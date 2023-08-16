<template>
  <div>
    <input
      id="upload_audio"
      accept="audio/*"
      aria-describedby="upload_audio"
      class="
        block
        w-full
        text-sm
        bg-white
        border border-gray-300
        cursor-pointer
        focus:outline-none
      "
      type="file"
      @input="onAudioChange"
    >
    <audio
      v-if="audioFile"
      id="uploaded_audio"
      class="mt-2"
      controls
      :src="audioSource"
      @durationchange="onDurationChange"
    />
    <div
      v-else
      id="upload_audio_info"
      class="mt-1 text-xs"
    >
      MP3, WAV, or OGG (MAX. 80Mb)
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue'

interface Props {
  modelValue: File
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'input'])

const audioFile: Ref<File> = ref(null)

const audioSource = computed(() => URL.createObjectURL(audioFile.value))

watch(
  () => props.modelValue,
  (val: File) => {
    audioFile.value = val
  },
  { immediate: true }
)

const onAudioChange = (e: Event) => {
  const files = e.target.files
  if (!files.length) return

  audioFile.value = files[0]
  emit('update:modelValue', audioFile.value)
  emit('input', audioFile.value)
}

const onDurationChange = (e: Event) => {
  audioFile.value.duration = e.target.duration
}
</script>

<style lang="scss" scoped>
input[type="file"]::-webkit-file-upload-button,
input[type="file"]::file-selector-button {
  @apply text-white bg-info hover: bg-secondary-blue font-medium text-sm cursor-pointer border-0 py-1.5 pl-8 pr-4;
  margin-inline-start: -1rem;
  margin-inline-end: 1rem;
}
</style>
