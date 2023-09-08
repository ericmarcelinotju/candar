<template>
  <DefaultPage :title="$t('app.columns.clientAddress')">
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
  detail as getClientAddress,
  insert as insertClientAddress,
  update as updateClientAddress
} from '@/api/client-address'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { ClientAddress } from '@/typings/models/client.type'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('address')

const initialData: Ref<ClientAddress> = ref()
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
  getClientAddress(id)
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
    return updateClientAddress(id, payload)
      .then(() => {
        router.back()
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertClientAddress(payload)
      .then(() => {
        router.back()
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
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
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
      col: 4
    },
    {
      key: 'sub_district',
      label: 'Sub District',
      col: 4
    },
    {
      key: 'postal_code',
      label: 'Postal Code',
      col: 4
    },
    {
      key: 'coordinates',
      label: 'Coordinates'
    }
  ]
}
initForm()
</script>
