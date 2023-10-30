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
      <template #contract="{ form }">
        <div v-if="form.clientId">
          <label
            class="default-label"
          >
            Contract
          </label>
          <Input
            :id="form.id"
            v-model="form.contractId"
            :callback="() => initOptions(form.clientId)"
            :options="contracts"
            type="dropdown"
          />
        </div>
      </template>
    </DefaultCreateEdit>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
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
import Input from '@/components/form/Input.vue'

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
if (typeof route.params.client_id === 'string') {
  clientId = route.params.client_id
}

const clients: Ref<Client[]> = ref([])
const clientOptions: Ref<Option[]> = computed(() =>
  clients.value.map((client) => ({
    label: client.name,
    value: client.id
  }))
)

const initPage = async () => {
  loading.value = true
  try {
    await getClient().then((res) => {
      res.data.data.forEach((data) => {
        data.hasContract = true
      })
      clients.value = res.data.data
    })

    if (id) {
      const resp = await getContract(id)
      initialData.value = resp.data
      initialData.value.clientId = resp.data?.client?.id
      initialData.value.dateFrom = new Date(resp.data?.dateFrom)
      initialData.value.dateTo = new Date(resp.data?.dateTo)
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
  const payload = {
    ...form.value
  } as Contract

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

watch(() => initialData.value, (val) => console.log(val))

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

onMounted(() => {
  initPage()
})

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
      isRequired: true,
      options: contracts.value
    },
    {
      key: 'content',
      label: 'Content',
      isRequired: true,
      rules: [required]
    }
  ]
}
initForm()
</script>
