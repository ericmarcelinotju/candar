<template>
  <DefaultPage :title="$t('app.columns.client')">
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
        {{ $t('app.create') }}
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
import DefaultTable from '@/components/default/Table.vue'
import { get as getClients, del as deleteClient } from '@/api/client'
import { useNotify } from '@/composables/use-notify'
import { Client } from '@/typings/models/client.type'
import { clientCreate, clientEdit } from '@/router/routes/client'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const { notify } = useNotify('client')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Client[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getClients(params)
    .then((res) => {
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(clientCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...clientEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Client> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteClient(id)
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

// Table columns setting
const columns = [
  {
    label: t('app.columns.id'),
    key: 'id',
    isHidden: true
  },
  {
    label: t('app.columns.code'),
    key: 'code',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.name'),
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.email'),
    key: 'email',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.phone_number'),
    key: 'phoneNumber',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.company_type'),
    key: 'companyType',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.purchase_type'),
    key: 'purchaseType',
    isSortable: true,
    isSearchable: true
  }
]

const hasPermission = (method, module = 'CLIENT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
