<template>
  <div>
    <DefaultPage :title="$t('module.user_import')">
      <div
        v-if="loading"
        class="w-full h-full flex justify-center items-center"
      >
        <Loading class="h-12 w-12" />
      </div>
      <template v-else>
        <DefaultCreateEdit
          v-if="!isUserImportSuccess"
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
                @change="(e) => onFileChange(e, onUserChange)"
              >
              <a
                v-if="userImportFile.file"
                class="group block mt-3 text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
                download
                :href="`${config.apiAddress}\\${userImportFile.name}`"
                target="_blank"
              >
                <DocumentIcon class="w-4 h-4 inline mb-[0.15rem]" />
                {{ getFileName(userImportFile.name) }}

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
                @change="onUserChange"
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
            :items="userImportList"
            :loading="loading"
            :total="itemsTotal"
          />
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
import { UserImport } from '@/typings/models/user-import.type'
import { useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'

// import { required } from '@/utils/validation'

import FileInput from '@/components/form/File.vue'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import DefaultTable from '@/components/default/Table.vue'
import Loading from '@/components/helper/Loading.vue'

import { PencilAltIcon } from '@heroicons/vue/solid'
import { DocumentIcon } from '@heroicons/vue/outline'

import {
  insert as importData,
  confirm as confirmImport
} from '@/api/user-import'

const loading: Ref<boolean> = ref(false)
const formSettings: Ref<FormSetting[]> = ref([])
const initialData: Ref<any> = ref()

const { t } = useI18n()
const router = useRouter()
const { notify } = useNotify('user')

const userImportFile: Ref<{ file: File, name: string }> = ref({
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
    label: t('app.columns.username'),
    key: 'username',
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
    label: t('app.columns.phone'),
    key: 'phone',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.first_name'),
    key: 'firstName',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.last_name'),
    key: 'lastName',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.role_code'),
    key: 'roleCode',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.division_code'),
    key: 'divisionCode',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.password'),
    key: 'password',
    isSortable: false,
    isSearchable: false
  }
]

const userImportList: Ref<UserImport[]> = ref([])
const itemsTotal = ref(0)
const isUserImportSuccess = computed(() => userImportList.value.length > 0)

const handleReset = () => {
  userImportList.value = []
  userImportFile.value = {
    file: null,
    name: null
  }
}

const onSubmit = (form, onFinish) => {
  const payload = new FormData()
  payload.append('file', userImportFile.value.file)

  // setTimeout(() => {
  //   userImportList.value = [
  //     {
  //       code: 'CLI-001',
  //       name: 'User Testing',
  //       companyType: 'Testing',
  //       purchaseType: 'standart',
  //       credit: 1000000,
  //       phoneNumber: '08123451',
  //       email: 'email@email.com',
  //       website: 'googlepedia.com',
  //       address: {
  //         name: 'default',
  //         address: 'Jl.Address no 5',
  //         province: 'Jakarta',
  //         city: 'Jakarta Barat',
  //         district: 'Tanjung Pinang',
  //         subDistrict: 'RW 10',
  //         postalCode: '15114',
  //         coordinates: [
  //           10,
  //           10
  //         ],
  //         isDefault: true
  //       },
  //       contact: {
  //         name: 'Kevin',
  //         division: 'IT',
  //         phoneNumber: '0812341',
  //         email: 'kevin@kevin.com'
  //       }
  //     }
  //   ]
  //   itemsTotal.value = userImportList.value.length
  // }, 2000)
  return importData(payload)
    .then((res) => {
      notify('inserted')
      userImportList.value = [
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
    ...userImportList.value
  ]

  loadingConfirm.value = true
  return confirmImport(payload)
    .then(() => {
      notify('inserted')
      router.push({ name: 'user' })
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

const onUserChange = (file) => {
  userImportFile.value.file = file
  userImportFile.value.name = getFileName(file)
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
