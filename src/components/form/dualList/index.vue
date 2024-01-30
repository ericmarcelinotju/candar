<template>
  <div class="flex items-center gap-4">
    <List
      v-model="selectedAvailableOptions"
      label="Available"
      :options="availableOptions"
    >
      <template #label="{ item }">
        <slot
          :item="item"
          name="label"
        />
      </template>
    </List>

    <div class="control">
      <button
        class="info-button"
        @click.prevent="onChooseAllClick"
      >
        <ChevronDoubleRightIcon class="w-5 h-6" />
      </button>
      <button
        class="info-button"
        @click.prevent="onChooseSelectionClick"
      >
        <ChevronRightIcon class="w-5 h-6" />
      </button>
      <button
        class="info-button"
        @click.prevent="onRemoveSelectionClick"
      >
        <ChevronLeftIcon class="w-5 h-6" />
      </button>
      <button
        class="info-button"
        @click.prevent="onRemoveAllClick"
      >
        <ChevronDoubleLeftIcon class="w-5 h-6" />
      </button>
    </div>

    <List
      v-model="selectedChoosenOptions"
      label="Selected"
      :options="choosenOptions"
    >
      <template #label="{ item }">
        <slot
          :item="item"
          name="label"
        />
      </template>
    </List>
  </div>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { reactive, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/solid'
import { BaseModel } from '@/typings/models/model.type'
import List from './List.vue'

interface Props {
  options: T[]
  modelValue?: T[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})
const emit = defineEmits(['update:modelValue'])

watch(
  () => props.options,
  (value) => {
    // Must clear array before assign
    availableOptions.splice(0)
    Object.assign(availableOptions, value.filter(option =>
      props.modelValue
        ? props.modelValue.findIndex(item => item.id === option.id) === -1
        : true)
    )
  }
)

const availableOptions = reactive(
  props.options.filter(option =>
    props.modelValue.findIndex(item => item.id === option.id) === -1))
const selectedAvailableOptions = reactive([])

const choosenOptions = reactive(props.modelValue || [])
const selectedChoosenOptions = reactive([])

const onChooseAllClick = () => {
  choosenOptions.push(...availableOptions)
  availableOptions.length = 0

  emit('update:modelValue', choosenOptions)
}

const onChooseSelectionClick = () => {
  choosenOptions.push(...selectedAvailableOptions)
  const filteredOptions = availableOptions.filter(item =>
    selectedAvailableOptions.findIndex(option =>
      item.id === option.id) === -1
  )
  availableOptions.length = 0
  availableOptions.push(...filteredOptions)

  emit('update:modelValue', choosenOptions)

  selectedAvailableOptions.splice(0)
}

const onRemoveSelectionClick = () => {
  availableOptions.push(...selectedChoosenOptions)
  const filteredOptions = choosenOptions.filter(item =>
    selectedChoosenOptions.findIndex(option =>
      item.id === option.id) === -1
  )
  choosenOptions.length = 0
  choosenOptions.push(...filteredOptions)

  emit('update:modelValue', choosenOptions)

  selectedChoosenOptions.splice(0)
}

const onRemoveAllClick = () => {
  availableOptions.push(...choosenOptions)
  choosenOptions.length = 0

  emit('update:modelValue', choosenOptions)
}
</script>

<style lang="scss" scoped>
.control {
  @apply flex flex-col gap-2;

  .info-button {
    @apply px-2 py-1;
  }
}
</style>
