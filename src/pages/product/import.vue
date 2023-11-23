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
        <DefaultTable
          :columns="columns"
          :items="items"
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
          <template #custom-body>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
            <td class="text-center">
              default
            </td>
          </template>
        </DefaultTable>
      </template>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed } from 'vue'
import { FormSetting } from '@/typings/form.type'
import { config } from '@/config'
// import { useI18n } from 'vue-i18n'
// import { required } from '@/utils/validation'

import FileInput from '@/components/form/File.vue'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import { PencilAltIcon } from '@heroicons/vue/solid'
import { DocumentIcon } from '@heroicons/vue/outline'

const loading: Ref<boolean> = ref(false)
const formSettings: Ref<FormSetting[]> = ref([])
const initialData: Ref<any> = ref()

const productImportFile: Ref<{ file: File, name: string }> = ref({
  file: null,
  name: null
})

const productImportList: Ref<any[]> = ref([])

const isProductImportSuccess = computed(() => productImportList.value.length > 0)
// const { t } = useI18n()

const onSubmit = (form, onFinish) => {
  console.log(productImportFile.value)
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

</style>
