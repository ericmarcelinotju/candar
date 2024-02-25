<template>
  <DefaultPage :title="$t('app.columns.company_bank')">
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
      <template #active="{ item }">
        <input
          :checked="item.active"
          class="default-checkbox"
          disabled
          style="margin-right: 0"
          type="checkbox"
        />
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
import {
  get as getCompanyBank,
  del as deleteCompanyBank
} from '@/api/company-bank'
import { useNotify } from '@/composables/use-notify'
import {
  companyBankCreate,
  companyBankEdit
} from '@/router/routes/company-bank'
import { TableColumn } from '@/typings/table.type'
import { CompanyBank } from '@/typings/models/company-bank.type'
import { Client } from '@/typings/models/client.type'
import { Option } from '@/typings/option.type'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('companyBank')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<CompanyBank[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  console.log(stateParams)
  loading.value = true
  getCompanyBank(params)
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

const handleCreate = () => {
  router.push(companyBankCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...companyBankEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<CompanyBank> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteCompanyBank(id)
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
      label: 'Bank Name',
      key: 'bank.name',
      isSortable: false,
      isSearchable: false
    },
    {
      label: 'Account Name',
      key: 'accountName',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Account Number',
      key: 'accountNumber',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Account Address',
      key: 'accountAddress',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Bank Swift Code',
      key: 'bankSwiftCode',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Bank Address',
      key: 'bankAddress',
      isSortable: true,
      isSearchable: true
    },
    {
      label: 'Active',
      key: 'active',
      isSortable: true,
      class: 'text-center'
    }
  ]
}
initColumns()

const hasPermission = (method, module = 'CONTRACT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
