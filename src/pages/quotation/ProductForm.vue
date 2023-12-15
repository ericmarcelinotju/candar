<template>
  <form class="flex mb-4">
    <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
      <div class="default-field">
        <label
          class="default-label"
          for="user"
        >
          {{ $t('module.product') }}<sup>*</sup>
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
          {{ $t('product.tier') }}
        </label>
        <Dropdown
          id="price"
          v-model="inputVal.tierId"
          class="default-input"
          :disabled="!inputVal.productId"
          :options="tierOptions"
          @input="onChangeTier"
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
    <div
      v-if="!isEdit || !inputVal.id"
      class="flex flex-col gap-4 ml-4"
    >
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
import { Ref, computed, ref } from 'vue'
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
  isEdit: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'delete'])

const productOptions: Ref<Option[]> = computed(() =>
  props.products.map((product) => ({
    label: `${product.name} : ${product.code} | Stock : ${product.stock}`,
    value: product.id
  }))
)

const tierOptions: Ref<Option[]> = computed(() =>
  props.tiers
    .filter(
      (tier) =>
        tier.productId === inputVal.value.productId &&
        tier.type === (props.hasContract ? 'regular' : 'iregular')
    )
    .map((tier) => ({
      label: `${tier.type} Tier: ${tier.name}  MOQ: ${tier.moq}  Price: ${tier.price}`,
      value: tier.id
    }))
)
const onChangeTier = (tierId: string) => {
  inputVal.value.price = +props.tiers.find(item => item.id === tierId).price
}

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
