<template>
  <div>
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
    <AddressList
      v-if="isEdit"
      :items="addresses"
    />
    <ContactList
      v-if="isEdit"
      :items="contacts"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import AddressList from './address/List.vue'
import ContactList from './contact/List.vue'
import {
  detail as getClient,
  insert as insertClient,
  update as updateClient
} from '@/api/client'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Client } from '@/typings/models/client.type'
import { clientList } from '@/router/routes/client'
import { companyTypes, purchaseTypes } from './options'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { notify } = useNotify('client')

const initialData: Ref<Client> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const isEdit = computed(() => !!route.params.id)

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
      label: t('app.columns.code'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'name',
      label: t('app.columns.name'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'companyType',
      label: t('app.columns.company_type'),
      isRequired: true,
      type: 'dropdown',
      col: 6,
      options: companyTypes
    },
    {
      key: 'purchaseType',
      label: t('app.columns.purchase_type'),
      isRequired: true,
      type: 'dropdown',
      col: 6,
      options: purchaseTypes
    },
    {
      key: 'credit',
      label: t('app.columns.credit'),
      type: 'number'
    },
    {
      key: 'phoneNumber',
      label: t('app.columns.phone_number'),
      col: 6
    },
    {
      key: 'email',
      label: t('app.columns.email'),
      col: 6
    },
    {
      key: 'website',
      label: t('app.columns.website')
    }
  ]
}
initForm()

const addresses = computed(() => initialData.value ? initialData.value.addresses : [])
const contacts = computed(() => initialData.value ? initialData.value.contacts : [])
</script>
