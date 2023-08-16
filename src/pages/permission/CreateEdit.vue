<template>
  <DefaultPage :title="$t('app.columns.permission')">
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
  detail as getPermission,
  insert as insertPermission,
  update as updatePermission
} from '@/api/permission'
import { required, alpha } from '@/utils/validation'
import { permissionList } from '@/router/routes/permission'
import { FormSetting } from '@/typings/form.type'
import { Permission } from '@/typings/models/permission.type'
import { Option } from '@/typings/option.type'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('permission')

const initialData: Ref<Permission> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const methodOptions: Ref<Option[]> = ref([
  {
    label: 'GET',
    value: 'GET'
  },
  {
    label: 'POST',
    value: 'POST'
  },
  {
    label: 'PUT',
    value: 'PUT'
  },
  {
    label: 'DELETE',
    value: 'DELETE'
  }
])

const initPage = () => {
  if (!id) return
  loading.value = true
  getPermission(id)
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
    return updatePermission(id, { ...form.value })
      .then(() => {
        router.push(permissionList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertPermission({ ...form.value })
      .then(() => {
        router.push(permissionList)
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
})

const formSettings: Ref<FormSetting[]> = ref([])
formSettings.value = [
  {
    key: 'module',
    label: 'Module',
    isRequired: true,
    autocomplete: 'permission-module',
    rules: [required, alpha]
  },
  {
    key: 'method',
    label: 'Method',
    isRequired: true,
    rules: [required],
    type: 'dropdown',
    options: methodOptions.value
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea'
  }
]
</script>
