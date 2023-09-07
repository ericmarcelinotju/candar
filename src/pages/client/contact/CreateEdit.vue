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
  detail as getClientContact,
  insert as insertClientContact,
  update as updateClientContact
} from '@/api/client-contact'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { ClientContact } from '@/typings/models/client.type'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('address')

const initialData: Ref<ClientContact> = ref()
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
  getClientContact(id)
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
    return updateClientContact(id, payload)
      .then(() => {
        router.back()
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertClientContact(payload)
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
      key: 'division',
      label: 'Division'
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
    }
  ]
}
initForm()
</script>
