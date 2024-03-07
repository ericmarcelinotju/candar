<template>
  <input
    v-bind="$props"
    ref="inputRef"
    type="text"
  >
</template>

<script setup lang="ts">
import { useCurrencyInput, CurrencyDisplay, CurrencyInputOptions } from 'vue-currency-input'
import { watchDebounced } from '@vueuse/core'

interface Props {
  modelValue: number
  options?: CurrencyInputOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    currency: 'IDR',
    currencyDisplay: CurrencyDisplay.hidden,
    locale: 'id-ID',
    hideGroupingSeparatorOnFocus: false
  })
})

const emit = defineEmits(['update:modelValue', 'input'])

const { inputRef, numberValue } = useCurrencyInput(props.options, false)

watchDebounced(numberValue, (value) => emit('update:modelValue', value), { debounce: 1000 })
</script>
