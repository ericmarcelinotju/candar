<template>
  <div>
    <DefaultPage :title="$t('module.product_category')">
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
        <template #variant>
          <label
            class="default-label"
          >
            {{ $t('app.columns.variant') }}
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
              <Menu
                v-if="isVariantDeleteable"
                as="div"
                class="relative inline-block text-left"
              >
                <div>
                  <MenuButton
                    class="success-button ml-2"
                  >
                    <DotsVerticalIcon
                      aria-hidden="true"
                      class="h-5 w-5 text-white"
                    />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems
                    class="z-20 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active, close }">
                        <button
                          :class="[
                            active ? 'bg-danger text-white' : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                          @click.prevent="() => handleDeleteRowVariant(index, close)"
                        >
                          <TrashIcon
                            :active="active"
                            aria-hidden="true"
                            :class="[active ? 'text-white' : 'text-black', 'mr-2 h-5 w-5']"
                          />
                          {{ $t('app.columns.delete_variant') }}
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <div class="mt-5">
              <button
                class="success-button"
                @click.prevent="handleAddVariant"
              >
                <span>{{ $t('app.columns.add_variant') }}</span>
              </button>
            </div>
          </div>
        </template>
        <template #iregular="{ form }">
          <label
            class="default-label mb-2"
          >
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
                  <label
                    class="default-label"
                  >
                    {{ $t('product.tier') }} {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400">
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    {{ $t('product.moq') }}
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
                    {{ $t('product.discount') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.iregular[index].discRate"
                    class="default-input"
                    type="number"
                  >
                </div>
                <div class="default-field col-span-2">
                  <label
                    class="default-label"
                    :for="`quantity-${index}`"
                  >
                    {{ $t('product.price') }}
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
            </div>
          </div>
        </template>
        <template #regular="{ form }">
          <label
            class="default-label mb-2"
          >
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
                  <label
                    class="default-label"
                  >
                    {{ $t('product.tier') }} {{ index + 1 }}
                  </label>
                  <hr class="w-full border-gray-400">
                </div>
                <div class="default-field">
                  <label
                    class="default-label"
                    :for="`price-${index}`"
                  >
                    {{ $t('product.moq') }}
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
                    {{ $t('product.discount') }}
                  </label>
                  <input
                    :id="`price-${index}`"
                    v-model="form.regular[index].discRate"
                    class="default-input"
                    type="number"
                  >
                </div>
                <div class="default-field col-span-2">
                  <label
                    class="default-label"
                    :for="`quantity-${index}`"
                  >
                    {{ $t('product.price') }}
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
      </DefaultCreateEdit>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Ref, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DotsVerticalIcon, TrashIcon } from '@heroicons/vue/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import Input from '@/components/form/Input.vue'
import {
  detail as getProductCategory,
  insert as insertProductCategory,
  update as updateProductCategory
} from '@/api/product-category'
import { get as getVariantCategories } from '@/api/variant-category'
import { FormSetting } from '@/typings/form.type'
import { ProductCategory, ProductContract } from '@/typings/models/product.type'
import { OptionObject } from '@/typings/option.type'
import { VariantCategory } from '@/typings/models/variant.type'
import { productCategoryList } from '@/router/routes/product'
import { roundingTwoDecimal, roundingNearestThousand } from '@/utils/number'
import { required } from '@/utils/validation'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { notify } = useNotify('variant')

const options: Ref<OptionObject[]> = ref([])

const modelValue: Ref<Array<{ value: { id: string, name: string, disabled: boolean }[], options: OptionObject[] }>> = ref([])

const initialData: Ref<ProductCategory> = ref(new ProductCategory())
const loading: Ref<boolean> = ref(false)

const isVariantDeleteable = computed(() => modelValue.value.length > 1)

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

const handleAddVariant = () => {
  const lengthValue = modelValue.value.length
  const lastOptions = lengthValue - 1
  const tempModelValue = modelValue.value[lastOptions]

  modelValue.value = [...modelValue.value, {
    value: [],
    options: [...tempModelValue.options.map((e: OptionObject) => {
      return {
        id: e.id,
        name: e.name,
        disabled: false,
        variant: [
          ...e.variant
        ]
      }
    })]
  }]
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

const handleDeleteRowVariant = (index: number, close: () => void) => {
  const tempValue = [...modelValue.value]

  tempValue.splice(index, 1)

  modelValue.value = tempValue
  close()
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
    ...form.value,
    variants,
    tiers
  }

  delete payload?.variant
  delete payload?.iregular
  delete payload?.regular

  if (id) {
    return updateProductCategory(id, payload)
      .then(() => {
        router.push(productCategoryList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertProductCategory(payload)
      .then(() => {
        router.push(productCategoryList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

const handleInputPrice = (form: any, current: ProductContract) => {
  let rawResult = 0
  const isDiscRateEmpty = current.discRate === undefined || current.discRate === 0

  if (!form.publishPrice) return rawResult

  if (isDiscRateEmpty) return roundingTwoDecimal(form.publishPrice.toFixed(2))

  rawResult = +(form.publishPrice * (1 - (+current.discRate / 100))).toFixed(2)
  return roundingTwoDecimal(rawResult)
}

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initOptions = async () => {
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
  getProductCategory(id)
    .then((res) => {
      initialData.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  initPage()
  initForm()
  initOptions()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: t('app.columns.code'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'name',
      label: t('app.columns.name'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'description',
      label: t('app.columns.description'),
      isRequired: true,
      rules: [required]
    }
  ]

  if (!id) {
    formSettings.value = [...formSettings.value,
    // {
    //   key: 'cost',
    //   label: 'Cost',
    //   isRequired: true,
    //   rules: [required],
    //   type: 'number'
    // },
      {
        key: 'price',
        label: t('app.columns.price'),
        isRequired: true,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'stock',
        label: t('app.columns.stock'),
        isRequired: true,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'variant',
        label: t('app.columns.variants'),
        isRequired: false
      },
      {
        key: 'hsCode',
        label: t('app.columns.hs_code'),
        isRequired: false,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'tariffBM',
        label: t('app.columns.bm_tariff'),
        isRequired: false,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'rateCOGS',
        label: t('app.columns.cogs_rate'),
        isRequired: false,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'cost',
        label: t('app.columns.cost'),
        isRequired: false,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'insurance',
        label: t('app.columns.insurance'),
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
        label: t('app.columns.freight'),
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
        label: t('app.columns.bm_duty'),
        isRequired: false,
        rules: [required],
        type: 'number',
        disabled: true,
        formula: (form) => {
          let rawResult = 0
          if (!form.cost || !form.tariffBM) return rawResult

          rawResult = +(form.cost * (form.tariffBM / 100)).toFixed(2)
          return roundingTwoDecimal(rawResult)
        },
        col: 6
      },
      {
        key: 'ppn',
        label: t('app.columns.ppn'),
        isRequired: false,
        rules: [required],
        type: 'number',
        disabled: true,
        formula: (form) => {
          let rawResult = 0

          if (!form.cost || !form.insurance || !form.freight || !form.BMDuty) return rawResult

          rawResult = +((form.cost + form.insurance + form.freight + form.BMDuty) * 0.11).toFixed(2)
          return roundingTwoDecimal(rawResult)
        },
        col: 6
      },
      {
        key: 'pph22',
        label: t('app.columns.pph'),
        isRequired: false,
        rules: [required],
        type: 'number',
        disabled: true,
        formula: (form) => {
          let rawResult = 0
          if (!form.cost || !form.insurance || !form.freight || !form.BMDuty) return rawResult

          rawResult = +((form.cost + form.insurance + form.freight + form.BMDuty) * 0.025).toFixed(2)
          return roundingTwoDecimal(rawResult)
        },
        col: 6
      },
      {
        key: 'repack',
        label: t('app.columns.repack'),
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
        label: t('app.columns.others'),
        isRequired: false,
        rules: [required],
        type: 'number',
        col: 6
      },
      {
        key: 'subtotal',
        label: t('app.columns.sub_total'),
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
        label: t('app.columns.cogs'),
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
        label: t('app.columns.sell_price'),
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
        label: t('app.columns.publish_price'),
        isRequired: false,
        rules: [required],
        type: 'number',
        disabled: true,
        formula: (form) => {
          let rawResult = 0
          if (!form.sellPrice) return rawResult

          rawResult = +(form.sellPrice).toFixed(0)
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
}
// const hasPermission = (method, module = 'USER') => {
//   return store.getters['auth/hasPermission'](module, method)
// }
// initForm()
</script>
