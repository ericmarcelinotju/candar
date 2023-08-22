<template>
  <DefaultPage :title="$t('app.columns.client')">
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
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getClient,
  insert as insertClient,
  update as updateClient
} from '@/api/client'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Client } from '@/typings/models/client.type'
import { clientList } from '@/router/routes/client'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('client')

const initialData: Ref<Client> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initOptions = async () => {
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getClient(id)
    .then(res => {
      initialData.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  if (id) {
    return updateClient(id, { ...form.value })
      .then(() => {
        router.push(clientList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertClient({ ...form.value })
      .then(() => {
        router.push(clientList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
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
      key: 'number',
      label: 'Number',
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
      key: 'industry',
      label: 'Industry',
      isRequired: true,
      type: 'dropdown',
      options: [
        {
          label: 'Teknologi',
          value: 'technology'
        },
        {
          label: 'Real Estate',
          value: 'real_estate'
        },
        {
          label: 'Government',
          value: 'government'
        },
        {
          label: 'Education',
          value: 'education'
        }
      ]
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea'
    },
    {
      key: 'coordinate',
      label: 'Coordinate'
    }
  ]
}
initForm()
</script>
