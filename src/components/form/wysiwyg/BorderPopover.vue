<template>
  <div class="flex mb-1">
    <div class="w-8 h-8 mr-1" />
    <button
      class="control-button mr-1 flex items-center justify-center"
      :title="`${title}-top`"
      @click="onBorderTop"
    >
      <svg
        class="h-6 w-6 bi bi-border-top"
        fill="currentColor"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0v1h16V0H0zm1 2.844v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM1 4.719V3.78H0v.938h1zm6.5-.938v.938h1V3.78h-1zm7.5 0v.938h1V3.78h-1zM1 6.594v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM.5 8.5h.469v-.031H1V7.53H.969V7.5H.5v.031H0v.938h.5V8.5zm1.406 0h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm2.813 0v-.031H8.5V7.53h-.031V7.5H7.53v.031H7.5v.938h.031V8.5h.938zm.937 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.469v-.031h.5V7.53h-.5V7.5h-.469v.031H15v.938h.031V8.5zM0 9.406v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-16 .937v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-16 .937v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zM0 16h.969v-.5H1v-.469H.969V15H.5v.031H0V16zm1.906 0h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm1.875-.5v.5h.938v-.5H8.5v-.469h-.031V15H7.53v.031H7.5v.469h.031zm1.875.5h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875-.5v.5H16v-.969h-.5V15h-.469v.031H15v.469h.031z" />
      </svg>
    </button>
    <div class="w-8 h-8 mr-1" />
  </div>
  <div class="flex mb-1">
    <button
      class="control-button mr-1 flex items-center justify-center"
      :title="`${title}-left`"
      @click="onBorderLeft"
    >
      <svg
        class="h-6 w-6 bi bi-border-left"
        fill="currentColor"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0v16h1V0H0zm1.906 1h.938V0h-.938v1zm1.875 0h.938V0H3.78v1zm1.875 0h.938V0h-.938v1zM7.531.969V1h.938V.969H8.5V.5h-.031V0H7.53v.5H7.5v.469h.031zM9.406 1h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zm1.875 0h.469V.969h.5V0h-.969v.5H15v.469h.031V1zM7.5 1.906v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM7.5 3.781v.938h1V3.78h-1zm7.5 0v.938h1V3.78h-1zM7.5 5.656v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM1.906 8.5h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm2.813 0v-.031H8.5V7.53h-.031V7.5H7.53v.031H7.5v.938h.031V8.5h.938zm.937 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.469v-.031h.5V7.53h-.5V7.5h-.469v.031H15v.938h.031V8.5zM7.5 9.406v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-8.5.937v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-8.5.937v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zM1.906 16h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm1.875-.5v.5h.938v-.5H8.5v-.469h-.031V15H7.53v.031H7.5v.469h.031zm1.875.5h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875-.5v.5H16v-.969h-.5V15h-.469v.031H15v.469h.031z" />
      </svg>
    </button>
    <div class="w-8 h-8 mr-1 flex items-center justify-center">
      <div class="bg-black w-2 h-2 rounded-full" />
    </div>
    <button
      class="control-button mr-1 flex items-center justify-center"
      :title="`${title}-right`"
      @click="onBorderRight"
    >
      <svg
        class="h-6 w-6 bi bi-border-right"
        fill="currentColor"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.969 0H0v.969h.5V1h.469V.969H1V.5H.969V0zm.937 1h.938V0h-.938v1zm1.875 0h.938V0H3.78v1zm1.875 0h.938V0h-.938v1zM7.531.969V1h.938V.969H8.5V.5h-.031V0H7.53v.5H7.5v.469h.031zM9.406 1h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zM16 0h-1v16h1V0zM1 2.844v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zM1 4.719V3.78H0v.938h1zm6.5-.938v.938h1V3.78h-1zM1 6.594v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zM.5 8.5h.469v-.031H1V7.53H.969V7.5H.5v.031H0v.938h.5V8.5zm1.406 0h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm2.813 0v-.031H8.5V7.53h-.031V7.5H7.53v.031H7.5v.938h.031V8.5h.938zm.937 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zM0 9.406v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zM0 11.281v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zM0 13.156v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zM0 16h.969v-.5H1v-.469H.969V15H.5v.031H0V16zm1.906 0h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm1.875-.5v.5h.938v-.5H8.5v-.469h-.031V15H7.53v.031H7.5v.469h.031zm1.875.5h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1z" />
      </svg>
    </button>
  </div>
  <div class="flex mb-1">
    <div class="w-8 h-8 mr-1" />
    <button
      class="control-button mr-1 flex items-center justify-center"
      :title="`${title}-bottom`"
      @click="onBorderBottom"
    >
      <svg
        class="h-6 w-6 bi bi-border-bottom"
        fill="currentColor"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.969 0H0v.969h.5V1h.469V.969H1V.5H.969V0zm.937 1h.938V0h-.938v1zm1.875 0h.938V0H3.78v1zm1.875 0h.938V0h-.938v1zM7.531.969V1h.938V.969H8.5V.5h-.031V0H7.53v.5H7.5v.469h.031zM9.406 1h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zm1.875 0h.938V0h-.938v1zm1.875 0h.469V.969h.5V0h-.969v.5H15v.469h.031V1zM1 2.844v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM1 4.719V3.78H0v.938h1zm6.5-.938v.938h1V3.78h-1zm7.5 0v.938h1V3.78h-1zM1 6.594v-.938H0v.938h1zm6.5-.938v.938h1v-.938h-1zm7.5 0v.938h1v-.938h-1zM.5 8.5h.469v-.031H1V7.53H.969V7.5H.5v.031H0v.938h.5V8.5zm1.406 0h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm2.813 0v-.031H8.5V7.53h-.031V7.5H7.53v.031H7.5v.938h.031V8.5h.938zm.937 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.469v-.031h.5V7.53h-.5V7.5h-.469v.031H15v.938h.031V8.5zM0 9.406v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-16 .937v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zm-16 .937v.938h1v-.938H0zm7.5 0v.938h1v-.938h-1zm8.5.938v-.938h-1v.938h1zM0 15h16v1H0v-1z" />
      </svg>
    </button>
    <div class="w-8 h-8 mr-1" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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

const borderTop = ref(false)
const borderBottom = ref(false)
const borderLeft = ref(false)
const borderRight = ref(false)

const borderClass = computed(() => {
  const borderClass = []
  if (borderTop.value) {
    borderClass.push('top')
  }
  if (borderBottom.value) {
    borderClass.push('bottom')
  }
  if (borderLeft.value) {
    borderClass.push('left')
  }
  if (borderRight.value) {
    borderClass.push('right')
  }
  return borderClass.join(' ')
})

const onBorderTop = () => {
  borderTop.value = !borderTop.value
  props.action(borderClass)
}

const onBorderBottom = () => {
  borderBottom.value = !borderBottom.value
  props.action(borderClass)
}

const onBorderLeft = () => {
  borderLeft.value = !borderLeft.value
  props.action(borderClass)
}

const onBorderRight = () => {
  borderRight.value = !borderRight.value
  props.action(borderClass)
}
</script>
