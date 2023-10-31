<template>
  <div>
    <DefaultPage :title="$t('app.columns.product')">
      <div
        v-if="loading"
        class="w-full h-full flex justify-center items-center"
      >
        <Loading class="h-12 w-12" />
      </div>
      <DefaultCreateEdit
        v-else
        :form-settings="formSettings"
        :initial-data="initialData"
        @submit="onSubmit"
      >
        <template #tariffBM="{ form, formSetting }">
          <template v-if="!isLocal">
            <label
              class="default-label"
              :for="formSetting.key"
            >
              Tarif BM<sup v-if="formSetting.isRequired">*</sup>
            </label>
            <Input
              :id="formSetting.key"
              v-model="form[formSetting.key]"
              :autocomplete="formSetting.autocomplete"
              :disabled="formSetting.disabled"
              :formula="formSetting.formula ? () => formSetting.formula(form) : null"
              :options="(formSetting.options as Option[])"
              :type="formSetting.type"
            />
          </template>
        </template>
        <template #hsCode="{ form, formSetting }">
          <template v-if="!isLocal">
            <label
              class="default-label"
              :for="formSetting.key"
            >
              HS Code<sup v-if="formSetting.isRequired">*</sup>
            </label>
            <Input
              :id="formSetting.key"
              v-model="form[formSetting.key]"
              :autocomplete="formSetting.autocomplete"
              :disabled="formSetting.disabled"
              :formula="formSetting.formula ? () => formSetting.formula(form) : null"
              :options="(formSetting.options as Option[])"
              :type="formSetting.type"
            />
          </template>
        </template>
        <template #source="{ form, formSetting }">
          <label
            class="default-label"
            :for="formSetting.key"
          >
            Sources<sup v-if="formSetting.isRequired">*</sup>
          </label>
          <Input
            :id="formSetting.key"
            :autocomplete="formSetting.autocomplete"
            :disabled="formSetting.disabled"
            :formula="formSetting.formula ? () => formSetting.formula(form) : null"
            :model-value="form[formSetting.key]"
            :options="(formSetting.options as Option[])"
            :type="formSetting.type"
            @update:model-value="(newValue) => handleUpdate(newValue, form, formSetting.key)"
          />
        </template>
        <template #variant>
          <label
            class="default-label"
          >
            Variant
          </label>
          <div class="flex flex-col justify-center bg-gray-50 px-5 py-4 rounded-xl space-y-5">
            <div
              v-for="(e, index) in modelValue"
              :key="`model-value-${index}`"
              class="flex flex-row items-center"
            >
              <Input
                v-model:object-model-value="e.value"
                disabled
                :index="index"
                :options="e.options"
                type="tags"
                @delete-variant="(e) => handleDeleteVariant(e)"
                @update-options="(e) => handleOptions(e)"
              />
            </div>
          </div>
        </template>
        <template #iregular="{ form }">
          <label
            class="default-label mb-2"
          >
            Iregular
          </label>
          <div class="flex flex-col bg-gray-50 px-5 py-4 rounded-xl">
            <div
              v-for="(_, index) in form.iregular"
              :key="`iregular-${index}`"
              class="flex mb-4 bg-white"
            >
              <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
                <div class="flex flex-col">
                  <label
                    class="default-label"
                  >
                    Tier {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400">
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    M.O.Q
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.iregular[index].moq"
                    class="default-input"
                    type="number"
                  >
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    DISC RATE
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.iregular[index].discRate"
                    class="default-input"
                    type="number"
                  >
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`quantity-${index}`"
                  >
                    Price/Unit
                  </label>
                  <input
                    :id="`quantity-${index}`"
                    class="default-input"
                    disabled
                    type="number"
                    :value="handleInputPrice(form, form.iregular[index])"
                  >
                </div>
              </div>
            <!-- <div class="flex flex-col gap-4 ml-4">
              <button
              class="default-button flex-1"
              type="button"
              @click="handleRemoveProduct(form, index)"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
              <button
                class="danger-button flex-1"
                type="button"
                @click="handleRemoveProduct(form, index)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div> -->
            </div>
          </div>
        </template>
        <template #regular="{ form }">
          <label
            class="default-label mb-2"
          >
            Regular
          </label>
          <div class="flex flex-col bg-gray-50 px-5 py-4 rounded-xl">
            <div
              v-for="(_, index) in form.regular"
              :key="`regular-${index}`"
              class="flex mb-4 bg-white"
            >
              <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
                <div class="flex flex-col">
                  <label
                    class="default-label"
                  >
                    Tier {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400">
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    M.O.Q
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.regular[index].moq"
                    class="default-input"
                    type="text"
                  >
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    DISC RATE
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.regular[index].discRate"
                    class="default-input"
                    type="number"
                  >
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`quantity-${index}`"
                  >
                    Price/Unit
                  </label>
                  <input
                    :id="`quantity-${index}`"
                    class="default-input"
                    disabled
                    type="number"
                    :value="handleInputPrice(form, form.regular[index])"
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </DefaultCreateEdit>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import Input from '@/components/form/Input.vue'

import {
  detail as getProduct,
  insert as insertProduct,
  update as updateProduct
} from '@/api/product'
import {
  get as getProductCategory
} from '@/api/product-category'
import { get as getVariantCategories } from '@/api/variant-category'

import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Product, ProductCategory, ProductContract } from '@/typings/models/product.type'
import { variantList } from '@/router/routes/variant'
import { VariantCategory } from '@/typings/models/variant.type'
import { Option, OptionObject } from '@/typings/option.type'
import { useStore } from 'vuex'
import { roundingTwoDecimal, convertFromCurrencyToNumber } from '@/utils/number'

const route = useRoute()
const router = useRouter()
const store = useStore()

const productCategories: Ref<ProductCategory[]> = ref([])
const productCategoryOptions: Ref<Option[]> = computed(() => productCategories.value.map(productCategory => ({ label: productCategory.name, value: productCategory.id })))

const sourceOptions: Ref<Option[]> = computed(() => [
  {
    label: 'Local',
    value: 'local'
  },
  {
    label: 'Import',
    value: 'import'
  }
])

const options: Ref<OptionObject[]> = ref([])

const { notify } = useNotify('product')

const modelValue: Ref<Array<{ value: { id: string, name: string, disabled: boolean }[], options: OptionObject[] }>> = ref([])

const initialData: Ref<Product> = ref(new Product())
const loading: Ref<boolean> = ref(false)

const source: Ref<string> = ref()
const isLocal = computed(() => source.value?.toLowerCase() === 'local')

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const handleDeleteVariant = (e: { id: string, index: number }) => {
  if (!e.id) return

  const { id } = e

  const tempValue = [...modelValue.value[e.index].value]
  const tempOptions = [...modelValue.value[e.index].options]

  const findIndex = tempOptions.findIndex((e2: OptionObject) => {
    return e2.variant.some((element: { id: string, name: string, disabled: boolean }) => {
      return id === element.id
    })
  })

  if (findIndex < 0) return

  tempOptions[findIndex].disabled = false

  const findindexVariant = tempValue.findIndex((e4: { id: string, name: string, disabled: boolean }) => e4.id === e.id)
  if (findindexVariant < 0) return

  tempValue.splice(findindexVariant, 1)

  modelValue.value[e.index].value = tempValue
}

const handleOptions = (e: { indexCategory: number, indexVariant: number, index: number }) => {
  const tempOptions = [...modelValue.value[e.index].options]

  const filteredOptions = [...tempOptions.map((e2: OptionObject, index2: number) => {
    if (+e.indexCategory === index2) {
      return {
        id: e2.id,
        name: e2.name,
        disabled: true,
        variant: [
          ...e2.variant
        ]
      }
    }
    return e2
  })]

  modelValue.value[e.index].options = [...filteredOptions]
}

const handleInputPrice = (form: any, current: ProductContract) => {
  let rawResult = 0
  if (!form.publishPrice || !current.discRate) return rawResult

  rawResult = +(form.publishPrice * (1 - (+current.discRate / 100))).toFixed(2)
  return roundingTwoDecimal(rawResult)
}

const handleUpdate = (val, form, key) => {
  form[key] = val
  source.value = val
}

const initOptions = async () => {
  getProductCategory()
    .then(res => {
      productCategories.value = res.data.data
      initForm()
    })
  getVariantCategories()
    .then(res => {
      if (res.status === 200) {
        const { data } = res.data
        data.map((e: VariantCategory) => {
          e.disabled = false
          return e
        })

        options.value = data as OptionObject[]
        modelValue.value = [{ value: [], options: [...data] as OptionObject[] }]
      }
    })
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getProduct(id)
    .then((res) => {
      res.data.cost = res.data.costNumber
      res.data.price = res.data.priceNumber
      res.data.BMDuty = convertFromCurrencyToNumber(res.data.BMDuty)
      res.data.cogs = convertFromCurrencyToNumber(res.data.cogs)
      res.data.freight = convertFromCurrencyToNumber(res.data.freight)
      res.data.insurance = convertFromCurrencyToNumber(res.data.insurance)
      res.data.others = convertFromCurrencyToNumber(res.data.others)
      res.data.pph22 = convertFromCurrencyToNumber(res.data.pph22)
      res.data.ppn = convertFromCurrencyToNumber(res.data.ppn)
      res.data.repack = convertFromCurrencyToNumber(res.data.repack)
      res.data.subtotal = convertFromCurrencyToNumber(res.data.subtotal)

      if (res.data.tiers.length <= 0) {
        initialData.value = {
          ...new Product(),
          ...res.data
        }
        return
      }
      res.data.iregular = []
      res.data.regular = []
      initialData.value = res.data
      res.data.tiers.forEach((e) => {
        initialData.value[e.type].push({
          id: e.id,
          moq: e.moq,
          discRate: e.discRate,
          price: 0
        })
      })
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  const variants = modelValue.value.map((e: { value: { id: string }[] }) => {
    return e.value
  })

  const tiers: Array<ProductContract & { id: string, name: string, type: string }> = []

  if (form.value?.iregular.length > 0) {
    form.value.iregular.forEach((e, i) => {
      let rawResult = +(form.value.publishPrice * (1 - (+e.discRate / 100))).toFixed(2)
      rawResult = roundingTwoDecimal(rawResult)

      tiers.push({
        moq: +e.moq,
        discRate: e.discRate,
        id: e.id,
        name: `tier ${i + 1}`,
        price: rawResult,
        type: 'iregular'
      })
    })
  }

  if (form.value?.regular.length > 0) {
    form.value.regular.forEach((e, i) => {
      let rawResult = +(form.value.publishPrice * (1 - (+e.discRate / 100))).toFixed(2)
      rawResult = roundingTwoDecimal(rawResult)

      tiers.push({
        moq: +e.moq,
        discRate: e.discRate,
        id: e.id,
        name: `tier ${i + 1}`,
        price: rawResult,
        type: 'regular'
      })
    })
  }

  const payload = {
    ...initialData.value,
    ...form.value,
    variants,
    tiers
  }

  delete payload.id
  delete payload.iregular
  delete payload.regular
  delete payload.category

  // if (isLocal.value) {
  //   delete payload.tariffBM
  //   delete payload.hsCode
  // }

  if (id) {
    delete payload.code

    return updateProduct(id, payload)
      .then(() => {
        router.push(variantList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertProduct(payload)
      .then(() => {
        router.push(variantList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

onMounted(() => {
  initPage()
  initOptions()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    // {
    //   key: 'code',
    //   label: 'Code',
    //   isRequired: true,
    //   rules: [required]
    // },
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'source',
      label: 'Sources',
      type: 'dropdown',
      isRequired: true,
      rules: [required],
      options: sourceOptions.value
    },
    {
      key: 'sku',
      label: 'SKU',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'stock',
      label: 'Stock',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'cost',
      label: 'Cost',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'price',
      label: 'Price',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'categoryId',
      label: 'Product Category',
      isRequired: true,
      type: 'dropdown',
      options: productCategoryOptions.value
    },
    {
      key: 'variant',
      label: 'Variants',
      isRequired: false
    },
    {
      key: 'hsCode',
      label: 'HS Code',
      isRequired: false,
      rules: [required],
      type: 'number',
      col: 6
    },
    {
      key: 'tariffBM',
      label: 'Tarif BM',
      isRequired: false,
      rules: [required],
      type: 'number',
      col: 6
    },
    {
      key: 'rateCOGS',
      label: 'COGS Rate',
      isRequired: false,
      rules: [required],
      type: 'number',
      col: 6
    },
    {
      key: 'cost',
      label: 'Cost',
      isRequired: false,
      rules: [required],
      type: 'number',
      col: 6
    },
    {
      key: 'insurance',
      label: 'Insurance',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost) return rawResult

        rawResult = +(form.cost * 0.005).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'freight',
      label: 'Freight',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost) return rawResult

        rawResult = +(form.cost * 0.27).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'BMDuty',
      label: 'BM / Duty',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost || (!isLocal.value && !form.tariffBM)) return rawResult

        if (!isLocal.value) (rawResult = +(form.cost * ((form.tariffBM) / 100)).toFixed(2))
        else (rawResult = 0)

        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'ppn',
      label: 'PPN',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.cost || !form.insurance || !form.freight || (!isLocal.value && !form.BMDuty)) return rawResult

        rawResult = +((form.cost + form.insurance + form.freight + form.BMDuty) * 0.11).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'pph22',
      label: 'Pph 22',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost || !form.insurance || !form.freight || (!isLocal.value && !form.BMDuty)) return rawResult

        rawResult = +((form.cost + form.insurance + form.freight + form.BMDuty) * 0.025).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'repack',
      label: 'Re Pack',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.pph22 || !form.ppn) return rawResult

        rawResult = +((form.cost + form.insurance + form.freight + form.BMDuty + form.ppn + form.pph22) * 0.03).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'others',
      label: 'Others',
      isRequired: false,
      type: 'number',
      col: 6
    },
    {
      key: 'subtotal',
      label: 'Sub Total',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        const isOthersEmpty = form.others === '' || form.others === undefined

        if (!form.pph22 || !form.ppn) return rawResult

        rawResult = +(form.cost + form.insurance + form.freight + form.BMDuty + form.ppn + form.pph22 + form.repack + (!isOthersEmpty ? form.others : 0)).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'cogs',
      label: 'COGS',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.rateCOGS || !form.subtotal) return rawResult

        rawResult = +(form.subtotal / (1 - (form.rateCOGS / 100))).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'sellPrice',
      label: 'Sell Price',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.cogs) return rawResult

        rawResult = +((form.cogs / (1 - 0.35)) * 1).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'publishPrice',
      label: 'Publish Price',
      isRequired: false,
      rules: [required],
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.sellPrice) return rawResult

        rawResult = +(form.sellPrice).toFixed(0)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'iregular',
      label: 'Iregular',
      isRequired: false
    },
    {
      key: 'regular',
      label: 'Regular',
      isRequired: false
    }
  ]
}
const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
initForm()
</script>
