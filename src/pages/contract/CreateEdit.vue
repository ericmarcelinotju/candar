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
    />
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
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

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('contract')

const initialData: Ref<Contract> = ref(new Contract())

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
      key: 'content',
      label: 'Content',
      isRequired: true,
      rules: [required]
    }
  ]
}
initForm()
</script>
