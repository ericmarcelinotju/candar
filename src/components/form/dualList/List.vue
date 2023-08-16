<template>
  <div class="flex-1 text-center">
    <b>{{ label }}</b>
    <div
      class="
        h-[420px]
        border border-gray-300
        overflow-y-auto
        text-left
        select-none
        rounded-md
      "
    >
      <div
        v-for="(option, idx) in options"
        :key="option.id"
        class="
          p-2
          cursor-pointer
          hover:bg-sky-100
          border border-white border-dashed
        "
        :class="{ 'bg-gray-300': getOptionIndex(option) >= 0 }"
        @click.ctrl="onControlClick(option)"
        @click.exact="onClick(option)"
        @click.shift="onShiftClick(idx, option)"
      >
        <slot
          :item="option"
          name="label"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { BaseModel } from '@/typings/models/model.type'
import { computed } from 'vue'

interface Props {
  options: T[]
  modelValue?: T[]
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})
const emit = defineEmits(['update:modelValue'])

const selectedOptions = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const onClick = (option) => {
  // Replace selection with the clicked item
  const optionIndex = getOptionIndex(option)
  if (optionIndex >= 0) {
    selectedOptions.value.splice(optionIndex, 1)
  } else {
    selectedOptions.value.length = 0
    selectedOptions.value.push(option)
  }
}

const onControlClick = (option) => {
  // Add the clicked item to selection
  const optionIndex = getOptionIndex(option)
  if (optionIndex >= 0) {
    selectedOptions.value.splice(optionIndex, 1)
  } else {
    selectedOptions.value.push(option)
  }
}

const onShiftClick = (idx, option) => {
  // Add all option between selection and the clicked option to the selection
  let firstIdx = Infinity
  for (const option of selectedOptions.value) {
    const selectionIdx = props.options.findIndex(item => item.id === option.id)
    if (selectionIdx >= 0 && selectionIdx < firstIdx) {
      firstIdx = selectionIdx
    }
  }

  selectedOptions.value.length = 0
  selectedOptions.value.push(...props.options.slice(firstIdx, idx + 1))
}

const getOptionIndex = (option) => {
  return selectedOptions.value.findIndex(selectedOption => selectedOption.id === option.id)
}
</script>
