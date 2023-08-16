<template>
  <DefaultPage :title="$t('app.columns.device')">
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
  detail as getDevice,
  insert as insertDevice,
  update as updateDevice
} from '@/api/device'
import { get as getDeviceTypes } from '@/api/deviceType'
import { get as getLocations } from '@/api/location'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Device } from '@/typings/models/device.type'
import { DeviceType } from '@/typings/models/deviceType.type'
import { Location } from '@/typings/models/location.type'
import { deviceList } from '@/router/routes/device'
import { Option } from '@/typings/option.type'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('device')

const initialData: Ref<Device> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const types: Ref<DeviceType[]> = ref([])
const typeOptions: Ref<Option[]> = computed(() => types.value.map(item => ({ label: item.name, value: item.id })))

const locations: Ref<Location[]> = ref([])
const locationOptions: Ref<Option[]> = computed(() => locations.value.map(item => ({ label: item.title, value: item.id })))

const initOptions = async () => {
  await getDeviceTypes()
    .then(res => {
      types.value = res.data.device_types
    })
  await getLocations()
    .then(res => {
      locations.value = res.data.locations
    })
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getDevice(id)
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
    return updateDevice(id, { ...form.value })
      .then(() => {
        router.push(deviceList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertDevice({ ...form.value })
      .then(() => {
        router.push(deviceList)
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
      key: 'serial_number',
      label: 'Serial Number',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'address',
      label: 'Address',
      isRequired: true
    },
    {
      key: 'tag',
      label: 'Tag'
    },
    {
      key: 'type_id',
      label: 'Type',
      isRequired: true,
      type: 'dropdown',
      options: typeOptions.value
    },
    {
      key: 'location_id',
      label: 'Location',
      isRequired: true,
      type: 'dropdown',
      options: locationOptions.value
    }
  ]
}
initForm()
</script>
