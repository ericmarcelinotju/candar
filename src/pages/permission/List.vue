<template>
  <DefaultPage :title="$t('app.columns.permission')">
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
    />
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
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/solid'
import {
  get as getPermission,
  del as deletePermission
} from '@/api/permission'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { Permission } from '@/typings/models/permission.type'
import { permissionCreate, permissionEdit } from '@/router/routes/permission'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const { notify } = useNotify('permission')

const columns = [
  {
    label: t('app.columns.id'),
    key: 'id',
    isHidden: true
  },
  {
    label: t('app.columns.module'),
    key: 'module',
    isSearchable: true,
    isSortable: true
  },
  {
    label: t('app.columns.method'),
    key: 'method',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.description'),
    key: 'description'
  }
]

const loading = ref(false)
let stateParams = reactive({})
const items = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getPermission(params)
    .then(res => {
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(permissionCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...permissionEdit, params: { id } })
}

const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Permission> = ref(null)
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deletePermission(id)
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

const hasPermission = (method, module = 'PERMISSION') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
