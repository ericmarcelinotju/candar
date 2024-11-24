<template>
  <DefaultPage :title="$t('app.columns.contract')">
    <DefaultTable
      :columns="tableColumns"
      :has-delete="hasPermission('DELETE')"
      :has-edit="hasPermission('PUT')"
      :items="items"
      :loading="loading"
      :total="itemsTotal"
      @delete="handleDelete"
      @edit="handleEdit"
      @search="handleSearch"
    >
      <template #clientId="{ item }">
        {{ item.client?.name }}
      </template>
    </DefaultTable>
    <template #action>
      <button
        v-if="hasPermission('POST')"
        class="info-button"
        type="button"
        @click="handleCreate"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        {{ $t('app.create') }}
      </button>
    </template>
    <template #search>
      <DefaultSearch
        :columns="tableColumns"
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
import { Ref, computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getContract, del as deleteContract } from '@/api/contract'
import { get as getClient } from '@/api/client'
import { useNotify } from '@/composables/use-notify'
import { contractCreate, contractEdit } from '@/router/routes/contract'
import { TableColumn } from '@/typings/table.type'
import { Contract } from '@/typings/models/contract.type'
import { Client } from '@/typings/models/client.type'
import { Option } from '@/typings/option.type'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('contract')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Contract[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getContract(params)
    .then((res) => {
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}

const clients: Ref<Client[]> = ref([])
const clientOptions: Ref<Option[]> = computed(() =>
  clients.value.map((client) => ({
    label: client.name,
    value: client.id
  }))
)

onMounted(() => {
  getClient()
    .then(res => {
      clients.value = res.data.data
      initColumns()
    })
})

const handleCreate = () => {
  router.push(contractCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...contractEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Contract> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteContract(id)
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
const tableColumns: Ref<TableColumn[]> = ref([])
const initColumns = () => {
  tableColumns.value = [
    {
      label: 'ID',
      key: 'id',
      isHidden: true
    },
    {
      label: 'Code',
      key: 'code',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Tanggal Kontrak Dimulai',
      key: 'dateFrom',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: 'Tanggal Kontrak Selesai',
      key: 'dateTo',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: 'Client',
      key: 'clientId',
      isSearchable: true,
      searchType: 'dropdown',
      searchOptions: clientOptions.value
    },
    {
      label: 'Content',
      key: 'content',
      isSortable: true
    }
  ]
}
initColumns()

const hasPermission = (method, module = 'CONTRACT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
