<template>
  <div>
    <DefaultPage :title="$t('module.product')">
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
        <template #source="{ formSetting, form }">
          <label class="default-label" :for="formSetting.key">
            {{ formSetting.label }}
          </label>
          <input
            :id="formSetting.key"
            v-model="form.source"
            class="default-input"
            false-value="local"
            :name="formSetting.key"
            true-value="import"
            type="checkbox"
          />
        </template>
        <template #variant>
          <label class="default-label">
            {{ $t('app.columns.variant') }}
          </label>
          <div
            class="flex flex-col justify-center bg-gray-50 px-5 py-4 rounded-xl space-y-5"
          >
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
          <label class="default-label mb-2">
            {{ $t('product_tier.irregular') }}
          </label>
          <div class="flex flex-col bg-gray-50 px-5 py-4 rounded-xl">
            <div
              v-for="(_, index) in form.iregular"
              :key="`iregular-${index}`"
              class="flex mb-4 bg-white"
            >
              <div class="grid grid-cols-2 flex-1 gap-4 border rounded-md p-4">
                <div class="col-span-2">
                  <label class="default-label">
                    {{ $t('product.tier') }} {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400" />
                </div>
                <div class="default-field">
                  <label class="default-label" :for="`price-${index}`">
                    {{ $t('product.moq') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.iregular[index].moq"
                    class="default-input"
                    type="number"
                  />
                </div>
                <div class="default-field">
                  <label class="default-label" :for="`price-${index}`">
                    {{ $t('product.discount') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.iregular[index].discRate"
                    class="default-input"
                    type="number"
                  />
                </div>
                <div class="default-field col-span-2">
                  <label class="default-label" :for="`quantity-${index}`">
                    {{ $t('product.price') }}
                  </label>
                  <input
                    :id="`quantity-${index}`"
                    class="default-input"
                    disabled
                    type="number"
                    :value="handleInputPrice(form, form.iregular[index])"
                  />
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
          <label class="default-label mb-2">
            {{ $t('product_tier.regular') }}
          </label>
          <div class="flex flex-col bg-gray-50 px-5 py-4 rounded-xl">
            <div
              v-for="(_, index) in form.regular"
              :key="`regular-${index}`"
              class="flex mb-4 bg-white"
            >
              <div class="grid grid-cols-2 flex-1 gap-4 border rounded-md p-4">
                <div class="col-span-2">
                  <label class="default-label">
                    {{ $t('product.tier') }} {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400" />
                </div>
                <div class="default-field">
                  <label class="default-label" :for="`price-${index}`">
                    {{ $t('product.moq') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.regular[index].moq"
                    class="default-input"
                    type="text"
                  />
                </div>
                <div class="default-field">
                  <label class="default-label" :for="`price-${index}`">
                    {{ $t('product.discount') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.regular[index].discRate"
                    class="default-input"
                    type="number"
                  />
                </div>
                <div class="default-field col-span-2">
                  <label class="default-label" :for="`quantity-${index}`">
                    {{ $t('product.price') }}
                  </label>
                  <input
                    :id="`quantity-${index}`"
                    class="default-input"
                    disabled
                    type="number"
                    :value="handleInputPrice(form, form.regular[index])"
                  />
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
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import Input from '@/components/form/Input.vue'
import {
  detail as getProduct,
  insert as insertProduct,
  update as updateProduct
} from '@/api/product'
import { get as getProductCategory } from '@/api/product-category'
import { get as getVariantCategories } from '@/api/variant-category'
import { productList } from '@/router/routes/product'
import { required } from '@/utils/validation'
import {
  roundingTwoDecimal,
  convertFromCurrencyToNumber,
  roundingNearestThousand
} from '@/utils/number'
import { FormSetting } from '@/typings/form.type'
import {
  Product,
  ProductCategory,
  ProductContract
} from '@/typings/models/product.type'
import { VariantCategory } from '@/typings/models/variant.type'
import { Option, OptionObject } from '@/typings/option.type'
import dayjs from 'dayjs'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()

const productCategories: Ref<ProductCategory[]> = ref([])
const productCategoryOptions: Ref<Option[]> = computed(() =>
  productCategories.value.map((productCategory) => ({
    label: productCategory.name,
    value: productCategory.id
  }))
)

const options: Ref<OptionObject[]> = ref([])

const { notify } = useNotify('product')

const modelValue: Ref<
  Array<{
    value: { id: string; name: string; disabled: boolean }[]
    options: OptionObject[]
  }>
> = ref([{ value: [], options: [] }])

const initialData: Ref<Product> = ref(new Product())
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const handleDeleteVariant = (e: { id: string; index: number }) => {
  if (!e.id) return

  const { id } = e

  const tempValue = [...modelValue.value[e.index].value]
  const tempOptions = [...modelValue.value[e.index].options]

  const findIndex = tempOptions.findIndex((e2: OptionObject) => {
    return e2.variant.some(
      (element: { id: string; name: string; disabled: boolean }) => {
        return id === element.id
      }
    )
  })

  if (findIndex < 0) return

  tempOptions[findIndex].disabled = false

  const findindexVariant = tempValue.findIndex(
    (e4: { id: string; name: string; disabled: boolean }) => e4.id === e.id
  )
  if (findindexVariant < 0) return

  tempValue.splice(findindexVariant, 1)

  modelValue.value[e.index].value = tempValue
}

const handleOptions = (e: {
  indexCategory: number
  indexVariant: number
  index: number
}) => {
  const tempOptions = [...modelValue.value[e.index].options]

  const filteredOptions = [
    ...tempOptions.map((e2: OptionObject, index2: number) => {
      if (+e.indexCategory === index2) {
        return {
          id: e2.id,
          name: e2.name,
          disabled: true,
          variant: [...e2.variant]
        }
      }
      return e2
    })
  ]

  modelValue.value[e.index].options = [...filteredOptions]
}

const handleInputPrice = (form: any, current: ProductContract) => {
  let rawResult = 0
  const isDiscRateEmpty =
    current.discRate === undefined || current.discRate === 0

  if (!form.publishPrice) return rawResult

  if (isDiscRateEmpty) return form.publishPrice

  rawResult = +(form.publishPrice * (1 - +current.discRate / 100)).toFixed(2)
  return roundingTwoDecimal(rawResult)
}

const initOptions = async () => {
  getProductCategory().then((res) => {
    productCategories.value = res.data.data
    initForm()
  })
  getVariantCategories().then((res) => {
    if (res.status === 200) {
      const { data } = res.data
      data.map((e: VariantCategory) => {
        e.disabled = false
        return e
      })

      options.value = data as OptionObject[]
      modelValue.value[0].options = [...data] as OptionObject[]
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
      res.data.bmDuty = convertFromCurrencyToNumber(res.data.bmDuty)
      res.data.cogs = convertFromCurrencyToNumber(res.data.cogs)
      res.data.freight = convertFromCurrencyToNumber(res.data.freight)
      res.data.insurance = convertFromCurrencyToNumber(res.data.insurance)
      res.data.others = convertFromCurrencyToNumber(res.data.others)
      res.data.pph22 = convertFromCurrencyToNumber(res.data.pph22)
      res.data.ppn = convertFromCurrencyToNumber(res.data.ppn)
      res.data.repack = convertFromCurrencyToNumber(res.data.repack)
      res.data.subTotal = convertFromCurrencyToNumber(res.data.subTotal)

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
          price: e.price
        })
      })

      const variantValue = res.data.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        disabled: false
      }))
      modelValue.value[0].value = variantValue
    })
    .catch((err) => {
      console.error(err)
      notify('loaded', 'danger', err)
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  const variants = modelValue.value.map((e: { value: { id: string }[] }) => {
    return e.value
  })

  const tiers: Array<
    ProductContract & { id: string; name: string; type: string }
  > = []

  if (form.value?.iregular.length > 0) {
    form.value.iregular.forEach((e, i) => {
      let rawResult = +(
        form.value.publishPrice *
        (1 - +e.discRate / 100)
      ).toFixed(2)
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
      let rawResult = +(
        form.value.publishPrice *
        (1 - +e.discRate / 100)
      ).toFixed(2)
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

  const format = 'DD MMMM YYYY'
  const expDate = form.value?.expDate && dayjs(form.value?.expDate).format(format)
  const entryDate = form.value?.entryDate && dayjs(form.value?.entryDate).format(format)

  const payload = {
    ...initialData.value,
    ...form.value,
    expDate,
    entryDate,
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
    return updateProduct(id, payload)
      .then(() => {
        router.push(productList)
        notify('updated')
      })
      .catch((err) => {
        notify('updated', 'danger', err.message)
      })
      .finally(onFinish)
  } else {
    return insertProduct(payload)
      .then(() => {
        router.push(productList)
        notify('inserted')
      })
      .catch((err) => {
        notify('inserted', 'danger', err.message)
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
    {
      key: 'code',
      label: 'Code',
      disabled: !!id
    },
    {
      key: 'name',
      label: t('app.columns.name'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'sku',
      label: t('app.columns.sku')
    },
    {
      key: 'no',
      label: t('app.columns.product_no')
    },
    {
      key: 'unitCode',
      label: t('app.columns.unit_code'),
      col: 4
    },
    {
      key: 'contain',
      label: t('app.columns.contain'),
      col: 4
    },
    {
      key: 'unit',
      label: t('app.columns.unit'),
      col: 4
    },
    {
      key: 'stock',
      label: t('app.columns.stock')
    },
    {
      key: 'categoryId',
      label: t('app.columns.category'),
      isRequired: true,
      type: 'dropdown',
      options: productCategoryOptions.value
    },
    {
      key: 'variant',
      label: t('app.columns.variants'),
      isRequired: false
    },
    {
      key: 'price',
      label: t('app.columns.price'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'source',
      label: t('app.columns.is_import'),
      type: 'checkbox'
    },
    {
      key: 'hsCode',
      label: t('app.columns.hs_code'),
      isRequired: false,
      type: 'number',
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'bmTariff',
      label: t('app.columns.bm_tariff'),
      isRequired: false,
      type: 'number',
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'rateCOGS',
      label: t('app.columns.cogs_rate'),
      isRequired: false,
      type: 'number',
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'cost',
      label: t('app.columns.cost'),
      isRequired: false,
      type: 'number',
      col: 6
    },
    {
      key: 'insurance',
      label: t('app.columns.insurance'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost) return rawResult

        rawResult = +(form.cost * 0.005).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'freight',
      label: t('app.columns.freight'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost) return rawResult

        rawResult = +(form.cost * 0.27).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'bmDuty',
      label: t('app.columns.bm_duty'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost || !form.bmTariff) return rawResult

        rawResult = +(form.cost * (form.bmTariff / 100)).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'ppn',
      label: t('app.columns.ppn'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.cost || !form.insurance || !form.freight || !form.bmDuty)
          return rawResult

        rawResult = +(
          (form.cost + form.insurance + form.freight + form.bmDuty) *
          0.11
        ).toFixed(2)

        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'pph22',
      label: t('app.columns.pph'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        if (!form.cost || !form.insurance || !form.freight || !form.bmDuty)
          return rawResult

        rawResult = +(
          (form.cost + form.insurance + form.freight + form.bmDuty) *
          0.025
        ).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'repack',
      label: t('app.columns.repack'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.pph22 || !form.ppn) return rawResult

        rawResult = +(
          (form.cost +
            form.insurance +
            form.freight +
            form.bmDuty +
            form.ppn +
            form.pph22) *
          0.03
        ).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'others',
      label: t('app.columns.others'),
      isRequired: false,
      type: 'number',
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'subTotal',
      label: t('app.columns.sub_total'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0
        const isOthersEmpty = form.others === '' || form.others === undefined

        if (!form.pph22 || !form.ppn) return rawResult

        rawResult = +(
          form.cost +
          form.insurance +
          form.freight +
          form.bmDuty +
          form.ppn +
          form.pph22 +
          form.repack +
          (!isOthersEmpty ? form.others : 0)
        ).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'cogs',
      label: t('app.columns.cogs'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        if (form.source !== 'import') {
          return form.cost
        }

        let rawResult = 0
        if (!form.rateCOGS || !form.subTotal) return rawResult

        rawResult = +(form.subTotal / (1 - form.rateCOGS / 100)).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6
    },
    {
      key: 'sellPrice',
      label: t('app.columns.sell_price'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        let rawResult = 0

        if (!form.cogs) return rawResult

        rawResult = +((form.cogs / (1 - 0.35)) * 1).toFixed(2)
        return roundingTwoDecimal(rawResult)
      },
      col: 6,
      isHidden: (form) => form.source !== 'import'
    },
    {
      key: 'batchNumber',
      label: t('app.columns.batch_number'),
      isRequired: false,
      col: 12
    },
    {
      key: 'entryDate',
      label: t('app.columns.entry_date'),
      isRequired: false,
      type: 'date',
      col: 6
    },
    {
      key: 'expDate',
      label: t('app.columns.expired_date'),
      isRequired: false,
      type: 'date',
      col: 6
    },
    {
      key: 'publishPrice',
      label: t('app.columns.publish_price'),
      isRequired: false,
      type: 'number',
      disabled: true,
      formula: (form) => {
        if (form.source !== 'import') {
          return form.price
        }

        let rawResult = 0
        if (!form.sellPrice) return rawResult

        rawResult = +form.sellPrice.toFixed(0)
        const roundedTwoDecimal = roundingTwoDecimal(rawResult)
        return roundingNearestThousand(roundedTwoDecimal)
      },
      col: 12
    },
    {
      key: 'iregular',
      label: t('product_tier.irregular'),
      isRequired: false
    },
    {
      key: 'regular',
      label: t('product_tier.regular'),
      isRequired: false
    }
  ]
}
initForm()
</script>
