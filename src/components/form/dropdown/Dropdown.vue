<template>
  <Listbox
    v-model="value"
    as="div"
    v-bind="{ [`${returnObject ? 'by' : ''}`]: itemKey }"
    class="relative"
    :disabled="disabled"
  >
    <ListboxLabel v-if="label">
      <label class="default-label">
        {{ label }}
      </label>
    </ListboxLabel>
    <ListboxButton
      :class="
        className
          ? className
          : 'px-3 py-2 text-left border border-gray-300 default-input'
      "
    >
      <span v-if="selectedOption" class="block truncate">
        {{ returnObject ? selectedOption[itemKey] : selectedOption.label }}
      </span>
      <span v-else class="block truncate text-gray-400">
        {{ placeholder }}
      </span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <SelectorIcon aria-hidden="true" class="w-5 h-5 text-gray-500" />
      </span>
    </ListboxButton>

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions
        class="absolute w-full py-1 mt-1 z-10 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
      >
        <ListboxOption
          v-for="option in returnObject ? optionsObject : options"
          :key="returnObject ? option[itemKey] : option.value"
          v-slot="{ active, selected }"
          as="template"
          :value="returnObject ? option : option.value"
        >
          <li
            :class="[
              active ? 'bg-gray-100' : 'text-gray-900',
              'cursor-default select-none relative py-2 pl-10 pr-4'
            ]"
          >
            <span
              :class="[
                selected ? 'font-medium' : 'font-normal',
                'block truncate'
              ]"
            >
              <slot :option="option" />
              {{ returnObject ? option[itemKey] : option.label }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600"
            >
              <CheckIcon aria-hidden="true" class="w-5 h-5 text-green-600" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import { Option } from '@/typings/option.type'

interface Props {
  options?: Option[]
  optionsObject?: any
  className?: string
  modelValue?:
    | string
    | string[]
    | { [x: string]: string | boolean | number }
    | any
  disabled?: boolean
  label?: string
  returnObject?: boolean
  itemKey?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  modelValue: '',
  disabled: false,
  label: null,
  returnObject: false,
  options: () => {
    return []
  },
  optionsObject: () => {
    return []
  },
  itemKey: 'key',
  placeholder: 'Select'
})

const emit = defineEmits(['update:modelValue', 'input'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
    emit('input', value)
  }
})

const selectedOption = computed(() => {
  if (props.returnObject === true) {
    return props.optionsObject
      ? props.optionsObject.find(
          (option) => option[props.itemKey] === value.value[props.itemKey]
        )
      : null
  }

  return props.options
    ? props.options.find((option) => option.value === value.value)
    : null
})
</script>
