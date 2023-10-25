<template>
  <Switch
    v-model="value"
    class="relative inline-flex h-[22px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    :class="[value ? 'bg-info' : 'bg-gray-400', hasText ? 'w-[64px]' : 'w-[40px]']"
  >
    <span
      v-if="value && hasText"
      class="pl-2 text-xs absolute left-0 font-semibold"
    >
      {{ textTrue }}
    </span>
    <span class="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      class="pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      :class="value ? [ hasText ? 'translate-x-10' : 'translate-x-4' ] : 'translate-x-0'"
    />
    <span
      v-if="!value && hasText"
      class="pr-1 text-xs absolute right-0 font-semibold"
    >
      {{ textFalse }}
    </span>
  </Switch>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  textTrue: {
    type: String,
    default: ''
  },
  textFalse: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'input'])

const hasText = computed(() => props.textTrue || props.textFalse)

const value = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
    emit('input', value)
  }
})
</script>
