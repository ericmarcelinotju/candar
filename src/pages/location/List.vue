<template>
  <DefaultPage :title="$t('app.columns.location')">
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
      <template #image="{ item }">
        <img
          alt="Broken Image"
          class="h-24 w-24 object-cover rounded-md"
          :src="item.image"
        >
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
        {{ $t('app.create') }}
      </button>
      <button>
        <CogIcon
          class="w-5 h-5 text-gray-500"
          @click="() => (visibleFieldConfigModal = true)"
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
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CogIcon, PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getLocations, del as deleteLocation } from '@/api/location'
import { useNotify } from '@/composables/use-notify'
import { locationCreate, locationEdit } from '@/router/routes/location'
import { Location } from '@/typings/models/location.type'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('location')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Location[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getLocations(params)
    .then((res) => {
      // TODO :: Filter by level
      // const currUser = store.getters['auth/user']
      // items.value = res.data.users.filter(user => user.role.level >= currUser.level)
      items.value = res.data.locations
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(locationCreate)
}

const columns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Parent ID',
    key: 'parent_id',
    isHidden: true
  },
  {
    label: 'Level',
    key: 'level'
  },
  {
    label: 'Image',
    key: 'image'
  },
  {
    label: 'Title',
    key: 'title'
  },
  {
    label: 'Coordinates',
    key: 'coordinates'
  }
]

const handleEdit = ({ id }) => {
  router.push({ ...locationEdit, params: { id } })
}

// Delete location
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Location> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteLocation(id)
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

const hasPermission = (method, module = 'LOCATION') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
