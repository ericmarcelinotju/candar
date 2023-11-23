<template>
  <div>
    <DefaultPage :title="$t('module.product_import')">
      <div
        v-if="loading"
        class="w-full h-full flex justify-center items-center"
      >
        <Loading class="h-12 w-12" />
      </div>
      <template v-else>
        <DefaultCreateEdit
          v-if="!isProductImportSuccess"
          :form-settings="formSettings"
          :initial-data="initialData"
          @submit="onSubmit"
        >
          <template #file="{ formSetting }">
            <div>
              <label
                class="default-label"
                :for="formSetting.key"
              >
                File Input<sup v-if="formSetting.isRequired">*</sup>
              </label>
              <input
                ref="inputFileEdit"
                style="display: none"
                type="file"
                @change="(e) => onFileChange(e, onProductChange)"
              >
              <a
                v-if="productImportFile.file"
                class="group block mt-3 text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
                download
                :href="`${config.apiAddress}\\${productImportFile.name}`"
                target="_blank"
              >
                <DocumentIcon class="w-4 h-4 inline mb-[0.15rem]" />
                {{ getFileName(productImportFile.name) }}

                <PencilAltIcon
                  class="hidden group-hover:block w-3 h-3 m-1 float-right"
                  @click.stop.prevent="handleFileEdit"
                />
              </a>
              <FileInput
                v-else
                id="excelFIle"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                info="XLS or XLSX"
                label="Drop Excel File to Upload, or"
                @change="onProductChange"
              />
            </div>
            <div class="flex flex-col mt-6 mb-2.5 bg-[#d6efff] rounded-md py-3 px-4">
              <ul>
                <li class="disclaimer-label font-bold">
                  Disclaimer:
                </li>
                <li class="disclaimer-label pl-2 my-0.5">
                  Gunakan template Excel yang sudah disediakan
                </li>
                <li class="disclaimer-label pl-2 my-0.5">
                  Apabila cell pada data blank, maka data tidak terupdate
                </li>
                <li class="disclaimer-label pl-2 my-0.5">
                  Pada column Variant diisikan Code dari Variant
                </li>
                <li class="disclaimer-label pl-2 my-0.5">
                  Pada column Category diisikan Code dari Category
                </li>
              </ul>
            </div>
          </template>
        </DefaultCreateEdit>
        <template v-else>
          <DefaultTable
            :columns="columns"
            :has-delete="false"
            :has-edit="false"
            :items="productImportList"
            :loading="loading"
            :total="itemsTotal"
          >
            <template #custom-head>
              <th
                class="head"
                colspan="9"
                scope="col"
                style="text-align: center;"
              >
                Iregular
              </th>
              <th
                class="head"
                colspan="9"
                scope="col"
                style="text-align: center;"
              >
                Regular
              </th>
            </template>
            <template #custom-head-2>
              <tr>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 1
                </th>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 2
                </th>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 3
                </th>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 1
                </th>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 2
                </th>
                <th
                  class="head"
                  colspan="3"
                  style="text-align: center;"
                >
                  Tier 3
                </th>
                <th />
              </tr>
              <tr>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  M.O.Q
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Disc. Rate
                </th>
                <th
                  class="head"
                  scope="col"
                >
                  Price/Unit
                </th>
                <th />
              </tr>
            </template>
            <template #custom-body="{ item }">
              <template
                v-for="el in item.tiers"
                :key="`tiers-${el.secureId}`"
              >
                <td class="text-center">
                  {{ el.moq }}
                </td>
                <td class="text-center">
                  {{ el.discRate }}
                </td>
                <td class="text-center">
                  {{ el.price }}
                </td>
              </template>
            </template>
          </DefaultTable>
          <div class="create-edit-submit-container">
            <button
              class="default-button mr-4"
              @click="handleReset"
            >
              {{ $t('app.reset') }}
            </button>
            <button
              class="success-button"
              @click="handleConfirm"
            >
              <Loading v-if="loadingConfirm" />
              Confirm
            </button>
          </div>
        </template>
      </template>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed } from 'vue'
import { FormSetting } from '@/typings/form.type'
import { config } from '@/config'
import { useI18n } from 'vue-i18n'
import { ProductImport } from '@/typings/models/product-import.type'
import { useRouter } from 'vue-router'
// import { required } from '@/utils/validation'

import FileInput from '@/components/form/File.vue'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import DefaultTable from '@/components/default/Table.vue'
import Loading from '@/components/helper/Loading.vue'


import { PencilAltIcon } from '@heroicons/vue/solid'
import { DocumentIcon } from '@heroicons/vue/outline'

const loading: Ref<boolean> = ref(false)
const formSettings: Ref<FormSetting[]> = ref([])
const initialData: Ref<any> = ref()

const { t } = useI18n()
const router = useRouter()

const productImportFile: Ref<{ file: File, name: string }> = ref({
  file: null,
  name: null
})

// Table columns setting
const columns = [
  {
    label: t('app.columns.id'),
    key: 'id',
    isHidden: true
  },
  {
    label: t('app.columns.code'),
    key: 'code',
    isSortable: true,
    isSearchable: true,
    isHidden: true
  },
  {
    label: t('app.columns.name'),
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.cost'),
    key: 'cost',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.price'),
    key: 'price',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.publish_price'),
    key: 'publishPrice',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.category'),
    key: 'category.name',
    isSortable: false,
    isSearchable: false
  }
]

const productImportList: Ref<ProductImport[]> = ref([])
const itemsTotal = ref(0)
const isProductImportSuccess = computed(() => productImportList.value.length > 0)

const handleReset = () => {
  productImportList.value = []
  productImportFile.value = {
    file: null,
    name: null
  }
}

const onSubmit = (form, onFinish) => {
  console.log(productImportFile.value)

  setTimeout(() => {
    productImportList.value = [
      {
        error: 'Product Duplicate',
        productCode: 'X1007VAVB',
        name: 'Produk A',
        description: 'Ini Produk A',
        sku: 'asdasd',
        unitCode: 'asd',
        contain: null,
        unit: null,
        hsCode: null,
        stock: 1,
        price: 5000000,
        cost: 500000,
        bmTariff: 0.05,
        rateCOGS: 0.28,
        insurance: 2500,
        freight: 135000,
        bmDuty: 25000,
        ppn: 72875,
        pph22: 16562.5,
        repack: 22558.125,
        others: null,
        subTotal: 774495.625,
        cogs: 1075688.368,
        sellPrice: 28133388088,
        publishPrice: 28133390000,
        variants: [
          [
            {
              id: 'ed541bae-57fd-4415-bb7a-dd89d23b515a',
              name: 'variant 2',
              code: 'VA',
              createdAt: '2023-10-18T17:48:49.489Z',
              updatedAt: '2023-10-18T17:48:49.489Z',
              disable: false
            },
            {
              id: 'd6f3398e-7a80-4691-9d2a-5ff43a4cb568',
              name: 'variant 1',
              code: 'VB',
              createdAt: '2023-10-18T17:48:49.489Z',
              updatedAt: '2023-10-18T17:48:49.489Z',
              disable: false
            }
          ]
        ],
        categoryId: 'c4259084-928c-467f-b780-212e5992309a',
        tiers: [
          {
            name: 'tier 1',
            type: 'regular',
            moq: 1,
            discRate: 0.12,
            price: 24757383200
          },
          {
            name: 'tier 2',
            type: 'regular',
            moq: 2,
            discRate: 2,
            price: -28133390000
          },
          {
            name: 'tier 3',
            type: 'regular',
            moq: 3,
            discRate: 3,
            price: -56266780000
          },
          {
            name: 'tier 1',
            type: 'irregular',
            moq: 4,
            discRate: 4,
            price: -84400170000
          },
          {
            name: 'tier 2',
            type: 'irregular',
            moq: 5,
            discRate: 5,
            price: -112533560000
          },
          {
            name: 'tier 3',
            type: 'irregular',
            moq: 6,
            discRate: 6,
            price: -140666950000
          }
        ]
      }
    ]
  }, 2000)
}

const loadingConfirm: Ref<boolean> = ref(false)

const handleConfirm = () => {
  loadingConfirm.value = true
  setTimeout(() => {
    loadingConfirm.value = false
    router.push({ name: 'product' })
  }, 1000)
}

const initForm = () => {
  formSettings.value = [
    {
      key: 'file',
      label: 'File Name',
      col: 8
    }
  ]
}

const getFileName = (attachment: File | string) => {
  if (typeof attachment === 'string') {
    const strs = attachment.split('\\')
    return strs[strs.length - 1]
  }

  return attachment.name
}

const onFileChange = (e, cb) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  cb(files[0])
}

const onProductChange = (file) => {
  productImportFile.value.file = file
  productImportFile.value.name = getFileName(file)
}

// Attachment
const inputFileEdit = ref(null)
const handleFileEdit = () => {
  inputFileEdit.value.click()
}

initForm()

</script>

<style lang="scss" scoped>
.disclaimer-label {
    @apply text-xs text-black-soft;
}

.head {
  @apply px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap;

  &.action {
    @apply text-center w-1;
  }
}

</style>
