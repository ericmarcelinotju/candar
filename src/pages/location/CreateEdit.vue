<template>
  <DefaultPage :title="$t('app.columns.user')">
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
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getLocation,
  insert as insertLocation,
  update as updateLocation,
  get as getLocations
} from '@/api/location'

import { FormSetting } from '@/typings/form.type'
import { jsonToFormData } from '@/utils/index'
import { locationList } from '@/router/routes/location'
import { Option } from '@/typings/option.type'
import { Location } from '@/typings/models/location.type'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('user')

const initialData: Ref<Location> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const locations: Ref<Location[]> = ref([])
const locationsOptions: Ref<Option[]> = computed(() =>
  locations.value.map((loc) => ({
    label: loc.title,
    value: loc.id
  }))
)

const initPage = () => {
  if (!id) return
  loading.value = true
  getLocation(id)
    .then((res) => {
      initialData.value = res.data
      if (res.data.coordinates != null) {
        initialData.value.latitude = res.data.coordinates[0]
        initialData.value.longitude = res.data.coordinates[1]
      }
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  if (form.value.latitude != null && form.value.longitude != null) {
    form.value.coordinates = [
      parseFloat(form.value.latitude),
      parseFloat(form.value.longitude)
    ]
  }
  if (form.value.image === '' || !(form.value.image instanceof File)) {
    delete form.value.image
  }
  form = jsonToFormData(form.value)
  if (id) {
    return updateLocation(id, form)
      .then(() => {
        router.push(locationList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertLocation(form)
      .then(() => {
        router.push(locationList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

const hasPermission = (method, module = 'LOCATION') => {
  return store.getters['auth/hasPermission'](module, method)
}

onMounted(() => {
  initPage()
  getLocations().then((res) => {
    locations.value = res.data.locations
    initForm()
  })
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'parent_id',
      label: 'Parent ID',
      isRequired: false,
      type: 'dropdown',
      options: locationsOptions.value
    },
    {
      key: 'level',
      label: 'Level',
      isRequired: true
    },
    {
      key: 'image',
      label: 'Image',
      type: 'image',
      isMultiple: false
    },
    {
      key: 'title',
      label: 'Title',
      isRequired: true
    },
    {
      key: 'latitude',
      label: 'Latitude'
    },
    {
      key: 'longitude',
      label: 'Longitude'
    }
  ]
}
initForm()
</script>
