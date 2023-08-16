<template>
  <Combobox
    v-model="value"
    :disabled="disabled"
  >
    <ComboboxLabel>
      <slot name="label" />
    </ComboboxLabel>
    <div class="relative">
      <div>
        <ComboboxInput
          autocomplete="off"
          :class="
            className
              ? className
              : 'px-3 py-2 text-left border border-gray-300 default-input'
          "
          :display-value="
            () => (selectedOption ? selectedOption.label : '')
          "
          @change="query = $event.target.value"
        />
        <ComboboxButton
          class="
              absolute
              inset-y-0
              right-0
              flex
              items-center
              pr-2
              pointer-events-none
            "
        >
          <SelectorIcon
            aria-hidden="true"
            class="w-5 h-5 text-gray-500"
          />
        </ComboboxButton>
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="
              absolute
              w-full
              py-1
              mt-1
              z-10
              overflow-auto
              text-base
              bg-white
              rounded-md
              shadow-lg
              max-h-60
              ring-1 ring-black ring-opacity-5
              focus:outline-none
              text-sm
              cursor-pointer
            "
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option.value"
            v-slot="{ active, selected }"
            as="template"
            :value="option.value"
          >
            <li
              :class="[
                active ? 'text-green-900 bg-green-100' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ option.label }}
              </span>
              <span
                v-if="selected"
                class="
                    absolute
                    inset-y-0
                    left-0
                    flex
                    items-center
                    pl-3
                    text-green-600
                  "
              >
                <CheckIcon
                  aria-hidden="true"
                  class="w-5 h-5 text-green-600"
                />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxLabel, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import { Option } from '@/typings/option.type'

interface Props {
  options: Option[]
  className?: string
  modelValue?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  modelValue: '',
  disabled: false
})

defineEmits(['update:modelValue', 'input'])

const query = ref('')
const value = computed({
  get () {
    return this.modelValue
  },
  set (value) {
    this.$emit('update:modelValue', value)
    this.$emit('input', value)
  }
})

const selectedOption = computed(() =>
  props.options ? props.options.find(option => option.value === value.value) : null
)

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter(option => {
      return option.label
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    })
)
</script>
