<template>
  <DefaultPage :title="$t('app.columns.deviceType')">
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
  detail as getDeviceType,
  insert as insertDeviceType,
  update as updateDeviceType
} from '@/api/deviceType'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { DeviceType } from '@/typings/models/deviceType.type'
import { deviceTypeList } from '@/router/routes/deviceType'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('deviceType')

const initialData: Ref<DeviceType> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getDeviceType(id)
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
    return updateDeviceType(id, { ...form.value })
      .then(() => {
        router.push(deviceTypeList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertDeviceType({ ...form.value })
      .then(() => {
        router.push(deviceTypeList)
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
const initForm = () => {
  formSettings.value = [
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'category',
      label: 'Category',
      isRequired: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea'
    }
  ]
}
initForm()
</script>
