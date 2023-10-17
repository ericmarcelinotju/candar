<template>
  <DefaultPage :title="$t('app.columns.quotation')">
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
      <template #project_id="{ item }">
        {{ item.project.code }}
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
import { get as getQuotations, del as deleteQuotation } from '@/api/quotation'
import { get as getProjects } from '@/api/project'
import { useNotify } from '@/composables/use-notify'
import { Quotation } from '@/typings/models/quotation.type'
import { quotationCreate, quotationEdit } from '@/router/routes/quotation'
import { TableColumn } from '@/typings/table.type'
import { Project } from '@/typings/models/project.type'
import { Option } from '@/typings/option.type'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('variant')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Quotation[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getQuotations(params)
    .then((res) => {
      items.value = res.data.data
      itemsTotal.value = res.data.total_item
    })
    .finally(() => {
      loading.value = false
    })
}

const projects: Ref<Project[]> = ref([])
const projectOptions: Ref<Option[]> = computed(() =>
  projects.value.map((project) => ({
    label: project.name,
    value: project.id
  }))
)

onMounted(() => {
  getProjects()
    .then(res => {
      projects.value = res.data.data
      initColumns()
    })
})

const handleCreate = () => {
  router.push(quotationCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...quotationEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Quotation> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteQuotation(id)
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
      label: 'Date',
      key: 'date',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: 'Project',
      key: 'project_id',
      isSearchable: true,
      searchType: 'dropdown',
      searchOptions: projectOptions.value
    }
  ]
}
initColumns()

const hasPermission = (method, module = 'CLIENT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
