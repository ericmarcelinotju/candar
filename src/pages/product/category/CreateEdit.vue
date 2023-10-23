<template>
  <div>
    <DefaultPage :title="$t('app.columns.variant')">
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
                          Delete Variant
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
                <span>Add Variant</span>
              </button>
            </div>
          </div>
        </template>
      </DefaultCreateEdit>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Ref, onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import Input from '@/components/form/Input.vue'
import { DotsVerticalIcon, TrashIcon } from '@heroicons/vue/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import {
  detail as getProductCategory,
  insert as insertProductCategory,
  update as updateProductCategory
} from '@/api/product-category'

import { get as getVariantCategories } from '@/api/variant-category'

import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { ProductCategory } from '@/typings/models/product.type'
import { OptionObject } from '@/typings/option.type'
import { productCategoryList } from '@/router/routes/product'
import { useStore } from 'vuex'
import { VariantCategory } from '@/typings/models/variant.type'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('variant')

const options: Ref<OptionObject[]> = ref([])

const modelValue: Ref<Array<{ value: { id: string, name: string, disabled: boolean }[], options: OptionObject[] }>> = ref([])

const initialData: Ref<ProductCategory> = ref()
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

  const payload = {
    ...form.value,
    variants
  }
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
  initForm()
  initPage()
  initOptions()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: 'Code',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'description',
      label: 'Description',
      isRequired: true,
      rules: [required]
    }
  ]

  if (!id) {
    formSettings.value = [...formSettings.value, {
      key: 'cost',
      label: 'Cost',
      isRequired: true,
      rules: [required],
      type: 'number'
    },
    {
      key: 'price',
      label: 'Price',
      isRequired: true,
      rules: [required],
      type: 'number'

    },
    {
      key: 'stock',
      label: 'Stock',
      isRequired: true,
      rules: [required],
      type: 'number'
    },
    {
      key: 'variant',
      label: 'Variants',
      isRequired: false
    }]
  }
}
// const hasPermission = (method, module = 'USER') => {
//   return store.getters['auth/hasPermission'](module, method)
// }
// initForm()
</script>
