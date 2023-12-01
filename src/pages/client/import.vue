<template>
  <div>
    <DefaultPage :title="$t('module.client_import')">
      <div
        v-if="loading"
        class="w-full h-full flex justify-center items-center"
      >
        <Loading class="h-12 w-12" />
      </div>
      <template v-else>
        <DefaultCreateEdit
          v-if="!isClientImportSuccess"
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
                @change="(e) => onFileChange(e, onClientChange)"
              >
              <a
                v-if="clientImportFile.file"
                class="group block mt-3 text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
                download
                :href="`${config.apiAddress}\\${clientImportFile.name}`"
                target="_blank"
              >
                <DocumentIcon class="w-4 h-4 inline mb-[0.15rem]" />
                {{ getFileName(clientImportFile.name) }}

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
                @change="onClientChange"
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
              </ul>
            </div>
          </template>
        </DefaultCreateEdit>
        <template v-else>
          <DefaultTable
            :columns="columns"
            :has-delete="false"
            :has-edit="false"
            :items="clientImportList"
            :loading="loading"
            :total="itemsTotal"
          >
            <template #[`address.coordinates`]="{ item }">
              {{ item.address && item.address.coordinates && item.address.coordinates.join(", ") }}
            </template>
            <template #error="{ item }">
              <CheckIcon
                v-if="item.error.length < 1"
                class="h-6 w-6 text-success"
              />
              <Popper
                v-else
                arrow
                hover
              >
                <XCircleIcon
                  class="h-6 w-6 text-danger"
                />
                <template #content>
                  <ul>
                    <li
                      v-for="(el, key) in item.error"
                      :key="key"
                      class="mb-0.5"
                    >
                      {{ el }}
                    </li>
                  </ul>
                </template>
              </Popper>
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
              :class="[isImportValid ? 'success-button' : 'disabled-button']"
              :disabled="!isImportValid"
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
import { ClientImport } from '@/typings/models/client-import.type'
import { useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'

// import { required } from '@/utils/validation'

import FileInput from '@/components/form/File.vue'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import DefaultTable from '@/components/default/Table.vue'
import Loading from '@/components/helper/Loading.vue'
import Popper from 'vue3-popper'

import { PencilAltIcon, CheckIcon } from '@heroicons/vue/solid'
import { DocumentIcon, XCircleIcon } from '@heroicons/vue/outline'

import {
  insert as importData,
  confirm as confirmImport
} from '@/api/client-import'

const loading: Ref<boolean> = ref(false)
const formSettings: Ref<FormSetting[]> = ref([])
const initialData: Ref<any> = ref()

const { t } = useI18n()
const router = useRouter()
const { notify } = useNotify('client')

const clientImportFile: Ref<{ file: File, name: string }> = ref({
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
    label: t('app.columns.company_type'),
    key: 'companyType',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.purchase_type'),
    key: 'purchaseType',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.credit'),
    key: 'credit',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.phone'),
    key: 'phoneNumber',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.email'),
    key: 'email',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.website'),
    key: 'website',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.address'),
    key: 'address.name',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.province'),
    key: 'address.province',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.city'),
    key: 'address.city',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.district'),
    key: 'address.district',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.sub_district'),
    key: 'address.subDistrict',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.postal_code'),
    key: 'address.postalCode',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.coordinates'),
    key: 'address.coordinates',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.contact_name'),
    key: 'contact.name',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.division'),
    key: 'contact.division',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.phone'),
    key: 'contact.phoneNumber',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.email'),
    key: 'contact.email',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.validation'),
    key: 'error',
    isSortable: false,
    isSearchable: false
  }
]

const clientImportList: Ref<ClientImport[]> = ref([])
const itemsTotal = ref(0)
const isClientImportSuccess = computed(() => clientImportList.value.length > 0)
const isImportValid = computed(() => clientImportList.value.some((e) => !(e.error.length > 0)))

const handleReset = () => {
  clientImportList.value = []
  clientImportFile.value = {
    file: null,
    name: null
  }
}

const onSubmit = (form, onFinish) => {
  const payload = new FormData()
  payload.append('file', clientImportFile.value.file)

  return importData(payload)
    .then((res) => {
      notify('inserted')
      clientImportList.value = [
        ...res.data
      ]
    })
    .catch(() => {
      notify('inserted', 'danger')
    })
    .finally(onFinish)
}

const loadingConfirm: Ref<boolean> = ref(false)

const handleConfirm = () => {
  const payload = [
    ...clientImportList.value
  ]

  loadingConfirm.value = true
  return confirmImport(payload)
    .then(() => {
      notify('inserted')
      router.push({ name: 'client' })
    })
    .catch(() => {
      notify('inserted', 'danger')
    })
    .finally(() => {
      loadingConfirm.value = true
    })
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

const onClientChange = (file) => {
  clientImportFile.value.file = file
  clientImportFile.value.name = getFileName(file)
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
