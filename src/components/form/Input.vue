<template>
  <Dropdown
    v-if="type === 'dropdown'"
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
  />
  <Combobox
    v-else-if="type === 'combobox'"
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
  />
  <DatePicker
    v-else-if="type === 'date'"
    v-model="inputVal"
    input-class-name="default-input"
  />
  <ImageInput
    v-else-if="type === 'image'"
    v-bind="$props"
    v-model="inputVal"
  />
  <textarea
    v-else-if="type === 'textarea'"
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
    :type="type"
  />
  <input
    v-else
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
    :type="type"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import { Option } from '@/typings/option.type'
import Dropdown from './dropdown/Dropdown.vue'
import Combobox from './dropdown/Combobox.vue'
import ImageInput from './image/ImageFile.vue'

interface Props {
  type?: string
  options?: Option[]
  className?: string
  modelValue?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  className: '',
  modelValue: '',
  options: () => []
})

const emit = defineEmits(['update:modelValue'])

const inputVal = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})
</script>
