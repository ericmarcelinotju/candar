<template>
  <DefaultPage :title="$t('app.columns.contract')">
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
      <template #attachment="{ form, formSetting }">
        <label
          class="default-label"
          :for="formSetting.key"
        >
          Attachment<sup v-if="formSetting.isRequired">*</sup>
        </label>
        <div>
          <input
            ref="inputAttachment"
            style="display: none"
            type="file"
            @change="(e) => onFileChange(e, form, onAttachmentChange)"
          >
          <a
            v-if="form.attachment"
            class="group block text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
            download
            :href="`${config.apiAddress}\\${form.attachment}`"
            target="_blank"
          >
            <DocumentIcon class="w-4 h-4 inline mb-[0.15rem]" />
            {{ getAttachmentName(form.attachment) }}

            <PencilAltIcon
              class="hidden group-hover:block w-3 h-3 m-1 float-right"
              @click.stop.prevent="handleAttachment"
            />
          </a>
          <p
            v-else
            class="text-sm"
          >
            <FileInput
              ref="inputAttachment"
              @change="(file) => onAttachmentChange(file, form)"
            />
          </p>
        </div>
      </template>
      <template #clientId="{ form, formSetting }">
        <label
          class="default-label"
          :for="formSetting.key"
        >
          Client<sup v-if="formSetting.isRequired">*</sup>
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
      <template #contract="{ form }">
        <div v-if="haveContract(form)">
          <label
            class="default-label"
          >
            Contract
          </label>
          <Input
            :id="form.id"
            v-model="form.contractId"
            :options="contracts"
            type="dropdown"
          />
        </div>
      </template>
    </DefaultCreateEdit>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'

import { DocumentIcon, PencilAltIcon } from '@heroicons/vue/outline'

import {
  get as getContractList,
  detail as getContract,
  insert as insertContract,
  update as updateContract
} from '@/api/contract'
import { get as getClient } from '@/api/client'

import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Contract } from '@/typings/models/contract.type'
import { contractList } from '@/router/routes/contract'
import { Option } from '@/typings/option.type'
import { Client } from '@/typings/models/client.type'
import { jsonToFormData } from '@/utils'

import FileInput from '@/components/form/File.vue'
import Input from '@/components/form/Input.vue'
import { config } from '@/config'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('contract')

const initialData: Ref<Contract> = ref(new Contract())
const contracts: Ref<Option[]> = ref([])

const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

let clientId = ''
if (typeof route.params.clientId === 'string') {
  clientId = route.params.clientId
}

type ClientOption = Option & { haveContract: boolean }

const clients: Ref<Client[]> = ref([])
const clientOptions: Ref<ClientOption[]> = computed(() =>
  clients.value.map((client) => ({
    label: client.name,
    value: client.id,
    haveContract: client.haveContract
  }))
)

const initPage = async () => {
  loading.value = true
  try {
    await getClient().then((res) => {
      clients.value = res.data.data
    })

    if (id) {
      const resp = await getContract(id)
      initialData.value = resp.data
      initialData.value.clientId = resp.data?.client?.id
      initialData.value.contractId = resp.data?.contract?.id
      initialData.value.dateFrom = new Date(resp.data?.dateFrom)
      initialData.value.dateTo = new Date(resp.data?.dateTo)

      if (resp.data?.client?.id) {
        initOptions(resp.data?.client.id)
      }
    }

    if (!id) {
      initialData.value.dateFrom = new Date()
      initialData.value.dateTo = new Date()
    }

    if (clientId) {
      initialData.value.clientId = clientId
    }

    initForm()
  } catch {
    notify('loaded', 'danger')
  } finally {
    loading.value = false
  }
}

const onSubmit = (form: Ref<Contract>, onFinish: () => void) => {
  const payload = jsonToFormData({
    ...form.value
  })

  if (id) {
    return updateContract(id, payload)
      .then(() => {
        router.push(contractList)
        notify('updated')
      })
      .catch(err => {
        notify('updated', 'danger', err.message)
      })
      .finally(onFinish)
  } else {
    return insertContract(payload)
      .then(() => {
        router.push(contractList)
        notify('inserted')
      })
      .catch(err => {
        notify('inserted', 'danger', err.message)
      })
      .finally(onFinish)
  }
}

const handleUpdate = (val, form, key) => {
  form[key] = val
  initOptions(val)
}

const initOptions = async (clientId: string) => {
  const contract = new Contract()
  contract.clientId = clientId
  getContractList(contract)
    .then((result) => {
      contracts.value = result.data.data.map(contract => {
        return {
          value: contract.id,
          label: contract.code
        }
      })
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
}

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: 'Kode',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'dateFrom',
      label: 'Tanggal Kontrak Dimulai',
      type: 'date',
      isRequired: true,
      rules: [required],
      col: 6
    },
    {
      key: 'dateTo',
      label: 'Tanggal Kontrak Selesai',
      type: 'date',
      isRequired: true,
      rules: [required],
      col: 6
    },
    {
      key: 'clientId',
      label: 'Client',
      type: 'dropdown',
      isRequired: true,
      rules: [required],
      options: clientOptions.value
    },
    {
      key: 'contract',
      label: 'Contract',
      type: 'dropdown',
      isRequired: false,
      options: contracts.value
    },
    {
      key: 'content',
      label: 'Content',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'attachment',
      label: 'Attachment',
      isRequired: false
    }
  ]
}

// Attachment
const inputAttachment = ref(null)
const handleAttachment = () => {
  inputAttachment.value.click()
}
const getAttachmentName = (attachment: File | string) => {
  if (typeof attachment === 'string') {
    const strs = attachment.split('\\')
    return strs[strs.length - 1]
  }

  return attachment.name
}
const onAttachmentChange = (file, form) => {
  form.attachment = file
}

const onFileChange = (e, form, cb) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  cb(files[0], form)
}

const haveContract = (form): boolean => {
  if (!form?.clientId) return false

  const result = clientOptions.value.some((e: ClientOption): boolean => {
    if (form.clientId === e.value) return e.haveContract
    return false
  })
  return result
}

onMounted(() => {
  initPage()
})
initForm()
</script>
