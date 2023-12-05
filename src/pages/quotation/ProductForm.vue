<template>
  <form class="flex mb-4">
    <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
      <div class="default-field">
        <label
          class="default-label"
          for="user"
        >
          Produk<sup>*</sup>
        </label>
        <Dropdown
          id="user"
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
          Harga
        </label>
        <Dropdown
          id="price"
          v-model="inputVal.tierId"
          class="default-input"
          :options="tierOptions"
        />
      </div>
      <div class="default-field">
        <label
          class="default-label"
          for="quantity"
        >
          Kuantitas
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
import { QuotationProduct } from '@/typings/models/quotation.type'
import { Product } from '@/typings/models/product.type'
import { ProductTier } from '@/typings/models/product-tier.type'
import { Option } from '@/typings/option.type'

interface Props {
  index: number
  products: Product[]
  tiers: ProductTier[]
  hasContract: boolean
  modelValue: QuotationProduct
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'delete'])

const productOptions: Ref<Option[]> = computed(() =>
  props.products.map((product) => ({
    label: `${product.name} : ${product.code}`,
    value: product.id
  }))
)

const tierOptions: Ref<Option[]> = computed(() =>
  props.tiers
    .filter(
      (tier) =>
        tier.productId === inputVal.value.productId &&
        tier.type === (props.hasContract ? 'regular' : 'iregular')
        // TODO : What happen when no price available
        // inputVal.value.quantity >= tier.moq
    )
    .map((tier) => ({
      label: `${tier.type} Tier: ${tier.name}  MOQ: ${tier.moq}  Price: ${tier.price}`,
      value: tier.id
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
