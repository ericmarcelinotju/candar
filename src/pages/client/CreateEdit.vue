<template>
  <DefaultPage :title="$t('app.columns.client')">
    <div v-if="loading" class="w-full h-full flex justify-center items-center">
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

const onSubmit = (form, onFinish) => {
  const payload = {
    ...form.value,
    coordinates: [form.coord_x, form.coord_y]
  }
  if (id) {
    return updateClient(id, payload)
      .then(() => {
        router.push(clientList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertClient(payload)
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
      key: 'company_type',
      label: 'Company Type',
      isRequired: true,
      type: 'dropdown',
      col: 6,
      options: [
        {
          label: 'Technology',
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
      key: 'purchase_type',
      label: 'Purchase Type',
      isRequired: true,
      type: 'dropdown',
      col: 6,
      options: [
        {
          label: 'Standard',
          value: 'standard'
        },
        {
          label: 'Planned',
          value: 'planned'
        },
        {
          label: 'Blanket',
          value: 'blanket'
        },
        {
          label: 'Contract',
          value: 'contract'
        }
      ]
    },
    {
      key: 'credit',
      label: 'Credit',
      type: 'number'
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      col: 6
    },
    {
      key: 'email',
      label: 'Email',
      col: 6
    },
    {
      key: 'website',
      label: 'Website'
    },
    {
      key: 'address',
      label: 'Address',
      type: 'label'
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea'
    },
    {
      key: 'province',
      label: 'Province',
      col: 6
    },
    {
      key: 'city',
      label: 'City',
      col: 6
    },
    {
      key: 'district',
      label: 'District',
      col: 6
    },
    {
      key: 'sub_district',
      label: 'Sub District',
      col: 6
    },
    {
      key: 'postal_code',
      label: 'Postal Code'
    },
    {
      key: 'coord_x',
      label: 'Coordinate X',
      type: 'number',
      col: 6
    },
    {
      key: 'coord_y',
      label: 'Coordinate Y',
      type: 'number',
      col: 6
    }
  ]
}
initForm()
</script>
