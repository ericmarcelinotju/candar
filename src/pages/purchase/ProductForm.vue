<template>
  <form class="flex mb-4">
    <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
      <div class="default-field">
        <label
          class="default-label"
          for="product"
        >
          {{ $t('app.columns.product') }}<sup>*</sup>
        </label>
        <Dropdown
          id="product"
          v-model="inputVal.productId"
          class="default-input"
          :options="productOptions"
        />
      </div>
      <div class="default-field">
        <label
          class="default-label"
          for="price"
        >
          {{ $t('app.columns.price') }}
        </label>
        <input
          id="price"
          v-model="inputVal.price"
          class="default-input"
          type="number"
        >
      </div>
      <div class="default-field">
        <label
          class="default-label"
          for="quantity"
        >
          {{ $t('app.columns.quantity') }}
        </label>
        <input
          id="quantity"
          v-model="inputVal.quantity"
          class="default-input"
          type="number"
        >
      </div>
    </div>
    <div class="flex flex-col gap-4 ml-4">
      <button
        class="danger-button flex-1"
        type="button"
        @click="handleDelete()"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Ref, computed } from 'vue'
import { TrashIcon } from '@heroicons/vue/solid'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import { PurchaseProduct } from '@/typings/models/purchase.type'
import { Product } from '@/typings/models/product.type'
import { Option } from '@/typings/option.type'

interface Props {
  index: number
  products: Product[]
  modelValue: PurchaseProduct
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'delete'])

const productOptions: Ref<Option[]> = computed(() =>
  props.products.map((product) => ({
    label: `${product.name} : ${product.code}`,
    value: product.id
  }))
)

const inputVal = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const handleDelete = () => {
  emit('delete', props.index)
}
</script>
