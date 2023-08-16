<template>
  <DefaultPage :title="$t('app.columns.role')">
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
      <template #permission="{ item }">
        {{ item.permissions.length }}
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
import { PlusIcon } from '@heroicons/vue/solid'
import {
  get as getRoles,
  del as deleteRole
} from '@/api/role'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { roleCreate, roleEdit } from '@/router/routes/role'
import { Role } from '@/typings/models/role.type'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('role')

const columns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Name',
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Description',
    key: 'description',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Permission',
    key: 'permission'
  }
]

const loading = ref(false)
let stateParams = reactive({})
const items: Ref<Role[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getRoles(params)
    .then(res => {
      items.value = res.data.roles
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(roleCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...roleEdit, params: { id } })
}

const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Role> = ref(null)
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteRole(id)
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

const hasPermission = (method) => {
  return store.getters['auth/hasPermission']('ROLE', method)
}
</script>
