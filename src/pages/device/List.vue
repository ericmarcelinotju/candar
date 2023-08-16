<template>
  <DefaultPage :title="$t('app.columns.device')">
    <DefaultTable
      :columns="columns"
      :has-delete="hasPermission('DELETE')"
      :has-edit="hasPermission('PUT')"
      :items="items"
      :loading="loading"
      :total="itemsTotal"
      @delete="handleDelete"
      @edit="handleEdit"
      @search="handleSearch"
    >
      <template #type="{ item }">
        <span>{{ item.device_type.name }}</span>
      </template>
      <template #location="{ item }">
        <span>{{ item.location.title }}</span>
      </template>
    </DefaultTable>
    <template #action>
      <button
        v-if="hasPermission('POST')"
        class="info-button mr-4"
        type="button"
        @click="handleCreate"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        {{ $t("app.create") }}
      </button>
      <button class="mr-2">
        <CogIcon
          class="w-5 h-5 text-gray-500"
          @click="() => (visibleFieldConfigModal = true)"
        />
      </button>
      <button>
        <RefreshIcon
          class="w-5 h-5 text-gray-500"
          :class="{ 'rotate': loadingSync }"
          @click="handleSync"
        />
      </button>
    </template>
    <template #search>
      <DefaultSearch
        :columns="columns"
        :loading="loading"
        @search="handleSearch"
      />
    </template>
    <template #dialog>
      <DefaultModal
        v-model="visibleDeleteConfirmationModal"
        :loading="loadingDelete"
        type="danger"
        @confirm="confirmDelete"
      />
    </template>
    <DefaultModal
      v-model="visibleFieldConfigModal"
      description="Please choose the item shown in the list:"
      :has-cancel="false"
      :has-icon="false"
      title="Edit List Options"
      type="info"
      @confirm="onConfirmFieldConfig"
    >
      <div class="mt-6 grid grid-cols-3 gap-4">
        <div
          v-for="field in columns.filter((field) => field.editable !== false)"
          :key="field"
          class="flex field"
        >
          <input
            :id="field.key"
            ref="visibleCheckboxRefs"
            :checked="!field.hidden"
            class="default-checkbox"
            type="checkbox"
          >
          <label
            class="default-label"
            :for="field.key"
          >
            {{ field.label }}
          </label>
        </div>
      </div>
      <template #action>
        <button
          class="default-button mr-6"
          type="button"
          @click="setDefaultFields"
        >
          {{ $t("app.set_default") }}
        </button>
      </template>
    </DefaultModal>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CogIcon, PlusIcon, RefreshIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getDevices, del as deleteDevice, sync as syncDevice } from '@/api/device'
import { get as getDeviceTypes } from '@/api/deviceType'
import { get as getLocations } from '@/api/location'
import { useNotify } from '@/composables/use-notify'
import { Device } from '@/typings/models/device.type'
import { deviceCreate, deviceEdit } from '@/router/routes/device'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('device')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Device[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getDevices(params)
    .then(res => {
      items.value = res.data.devices
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(deviceCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...deviceEdit, params: { id } })
}

// Delete device
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Device> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteDevice(id)
    .then(() => {
      handleSearch(stateParams)
      notify('deleted')
    })
    .catch(() => {
      notify('deleted', 'danger')
    })
    .finally(() => {
      loadingDelete.value = false
      visibleDeleteConfirmationModal.value = false
    })
}

const initSearchOptions = () => {
  getDeviceTypes()
    .then(res => {
      const deviceColumn = columns.find(column => column.key === 'type_id')
      deviceColumn.options = res.data.device_types.map(item => ({ label: item.name, value: item.id }))
    })
  if (hasPermission('GET', 'LOCATION')) {
    getLocations()
      .then(res => {
        const locationColumn = columns.find(column => column.key === 'location_id')
        locationColumn.options = res.data.locations.map(item => ({ label: item.title, value: item.id }))
      })
  }
}

onMounted(() => {
  initSearchOptions()
})

// Table columns setting
const copyColumns = [...store.getters['columns/device']]
const columns = reactive(copyColumns)
const visibleCheckboxRefs = ref([])
const visibleFieldConfigModal = ref(false)
const onConfirmFieldConfig = () => {
  for (const checkbox of visibleCheckboxRefs.value) {
    const field = columns.find((field) => field.value === checkbox.id)
    field.hidden = !checkbox.checked
  }
  store.commit('columns/setDevice', columns)
}
const setDefaultFields = () => {
  store.commit('columns/setDefaultDevice')
  Object.assign(columns, [...store.getters['columns/device']])
}

const loadingSync = ref(false)
const handleSync = () => {
  loadingSync.value = true
  syncDevice()
    .then(() => {
      handleSearch(stateParams)
      notify('synchronize')
    })
    .catch(() => {
      notify('synchronize', 'danger')
    })
    .finally(() => {
      loadingSync.value = false
    })
}

const hasPermission = (method, module = 'DEVICE') => {
  return store.getters['auth/hasPermission'](module, method)
}

</script>
