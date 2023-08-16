<template>
  <div class="flex w-64 mb-2 mr-2">
    <div
      class="relative flex items-center rounded-md shadow-sm w-full ml-1 mr-3"
    >
      <input
        id="image-link"
        v-model="imageLink"
        class="pr-14 default-input"
        name="image-link"
        type="text"
      >
      <button
        class="default-input-info-right is-button"
        title="image-link"
        @click="onLinkClick"
      >
        <svg
          id="ri-link-m"
          class="w-6 h-6"
          viewBox="0 0 24 24"
        >
          <g>
            <path
              d="M0 0h24v24H0z"
              fill="none"
            />
            <path d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" />
          </g>
        </svg>
      </button>
    </div>
    <button
      class="control-button mt-1"
      title="image-upload"
      @click.stop="onUploadClick"
    >
      <svg
        id="ri-image-add-fill"
        class="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M0 0h24v24H0z"
            fill="none"
          />
          <path d="M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm.008-12c.548 0 .992.445.992.993v9.349A5.99 5.99 0 0 0 20 13V5H4l.001 14 9.292-9.293a.999.999 0 0 1 1.32-.084l.093.085 3.546 3.55a6.003 6.003 0 0 0-3.91 7.743L2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016zM8 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </g>
      </svg>
    </button>
    <input
      ref="fileInput"
      accept="image/*"
      class="hidden"
      type="file"
      @change="handleUpload"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { httpUrl } from '@/utils/validation'
import { upload } from '@/api/media'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  action: {
    type: Function,
    required: true
  }
})

const fileInput = ref(null)
const imageLink = ref('')

const onLinkClick = () => {
  if (httpUrl(imageLink.value)) {
    props.action(imageLink.value)
    return
  }
  imageLink.value = ''
}

const onUploadClick = () => {
  fileInput.value.click()
}

const handleUpload = (event) => {
  const imageFile = event.target.files[0]

  const formData = new FormData()
  formData.append('file', imageFile)

  upload(formData)
    .then((resp) => {
      const filename = resp.data
      if (filename) {
        props.action(filename)
      }
    })
}
</script>

<style lang="scss" scoped>
.control-button {
  height: auto;
  width: auto;
}
</style>
