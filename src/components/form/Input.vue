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
    auto-apply
    :clearable="false"
    :enable-time-picker="false"
    input-class-name="default-input"
  />
  <DatePicker
    v-else-if="type === 'date_range'"
    v-model="inputVal"
    auto-apply
    :clearable="false"
    :enable-time-picker="false"
    input-class-name="default-input"
    range
  />
  <ImageInput v-else-if="type === 'image'" v-bind="$props" v-model="inputVal" />
  <FileInput v-else-if="type === 'file'" v-bind="$props" v-model="inputVal" />
  <textarea
    v-else-if="type === 'textarea'"
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
    :type="type"
  />
  <Tags
    v-else-if="type === 'tags'"
    v-bind="$props"
    v-model="objectInputVal"
    class="default-input"
    :index="index"
    :type="type"
    @delete-variant="(e) => $emit('delete-variant', e)"
    @update-options="(e) => $emit('update-options', e)"
  />
  <input
    v-else
    v-bind="$props"
    v-model="inputVal"
    class="default-input"
    :disabled="disabled"
    :type="type"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import { Option, OptionObject } from '@/typings/option.type'
import Dropdown from './dropdown/Dropdown.vue'
import Combobox from './dropdown/Combobox.vue'
import ImageInput from './image/ImageFile.vue'
import FileInput from './File.vue'
import Tags from './combobox/Tags.vue'

interface Props {
  type?: string
  options?: Option[] | OptionObject[]
  className?: string
  modelValue?: string | string[] | number | Date | boolean
  objectModelValue?: { id: string; name: string; disabled: boolean }[]
  disabled?: boolean
  index?: number | null
  formula?: (() => number | string | null) | null
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  className: '',
  modelValue: '',
  objectModelValue: () => {
    return [{ id: '', name: '', disabled: false }]
  },
  options: () => [],
  index: null,
  formula: null
})

const emit = defineEmits([
  'update:modelValue',
  'update:objectModelValue',
  'update-options',
  'delete-variant'
])

const inputVal = computed({
  get() {
    if (props.formula) {
      const result = props.formula()
      emit('update:modelValue', result)
      return result
    }
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const objectInputVal = computed({
  get() {
    return props.objectModelValue
  },
  set(val) {
    emit('update:objectModelValue', val)
  }
})
</script>
