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
      <template #action="{ item }">
        <template v-if="isManager">
          <button
            v-if="!item.approveManager"
            class="info-button mr-3 !py-1"
            type="button"
            @click="handleApproveManager(item)"
          >
            Approve
          </button>
          <button
            v-else-if="!item.approveClient"
            class="warning-button mr-3 !py-1"
            type="button"
          >
            Need Approval
          </button>
          <button
            v-else
            class="success-button mr-3 !py-1"
            type="button"
            @click="handleViewApproval(item)"
          >
            Approved
          </button>
        </template>
        <template v-else>
          <button
            v-if="!item.approveManager"
            class="warning-button mr-3 !py-1"
            type="button"
          >
            Need Approval
          </button>
          <button
            v-else-if="!item.approveClient"
            class="info-button mr-3 !py-1"
            type="button"
            @click="handleApproveClient(item)"
          >
            Approve
          </button>
          <button
            v-else
            class="success-button mr-3 !py-1"
            type="button"
            @click="handleViewApproval(item)"
          >
            Approved
          </button>
        </template>
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
      <DefaultModal
        v-model="visibleApproveManagerConfirmationModal"
        :loading="loadingApproveManager"
        type="info"
        @confirm="confirmApproveManager"
      />
      <DefaultModal
        v-model="visibleApproveClientConfirmationModal"
        :loading="loadingApproveClient"
        type="info"
        @confirm="confirmApproveClient"
      >
        <FileInput
          v-model="approveClientItem.approvalAttachment"
          class="mt-3"
        />
      </DefaultModal>
      <DefaultModal
        v-model="visibleViewApprovalConfirmationModal"
        description=""
        :loading="false"
        title="Approval Detail"
        type="info"
      >
        <div class="mt-6 flex gap-6 items-center">
          <div>Approved by :</div>
          <div>{{ viewApprovalItem.approvedBy?.username }}</div>
        </div>

        <div class="mt-3 flex gap-6 items-center">
          <div>Attachment :</div>
          <a
            class="info-button"
            :href="viewApprovalItem.approvalAttachment"
            target="_blank"
          >
            Download
          </a>
        </div>
      </DefaultModal>
    </template>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import FileInput from '@/components/form/File.vue'
import { get as getQuotations, del as deleteQuotation, approveManager, approveClient } from '@/api/quotation'
import { get as getProjects } from '@/api/project'
import { useNotify } from '@/composables/use-notify'
import { Quotation } from '@/typings/models/quotation.type'
import { quotationCreate, quotationEdit } from '@/router/routes/quotation'
import { TableColumn } from '@/typings/table.type'
import { Project } from '@/typings/models/project.type'
import { Option } from '@/typings/option.type'
import { downloadBlob } from '@/utils'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('variant')

const isManager = computed(() => {
  const user = store.getters['auth/user']
  return user.role.isManager
})

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

// Approve by manager
const loadingApproveManager = ref(false)
const visibleApproveManagerConfirmationModal = ref(false)
const approveManagerItem: Ref<Quotation> = ref()
const handleApproveManager = (data) => {
  visibleApproveManagerConfirmationModal.value = true
  approveManagerItem.value = data
}
const confirmApproveManager = () => {
  const { id } = approveManagerItem.value
  loadingApproveManager.value = true
  approveManager(id)
    .then(() => {
      handleSearch(stateParams)
      notify('approved')
    })
    .catch(() => {
      notify('approved', 'danger')
    })
    .finally(() => {
      loadingApproveManager.value = false
      visibleApproveManagerConfirmationModal.value = false
    })
}

// Approve by client
const loadingApproveClient = ref(false)
const visibleApproveClientConfirmationModal = ref(false)
const approveClientItem: Ref<Quotation> = ref()
const handleApproveClient = (data) => {
  visibleApproveClientConfirmationModal.value = true
  approveClientItem.value = data
}
const confirmApproveClient = () => {
  const { id } = approveClientItem.value
  loadingApproveClient.value = true

  const payload = new FormData()
  payload.append('attachment', approveClientItem.value.approvalAttachment)

  approveClient(id, payload)
    .then(() => {
      handleSearch(stateParams)
      notify('approved')
    })
    .catch(() => {
      notify('approved', 'danger')
    })
    .finally(() => {
      loadingApproveClient.value = false
      visibleApproveClientConfirmationModal.value = false
    })
}

// View approval
const visibleViewApprovalConfirmationModal = ref(false)
const viewApprovalItem: Ref<Quotation> = ref()
const handleViewApproval = (data) => {
  visibleViewApprovalConfirmationModal.value = true
  viewApprovalItem.value = data
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
      label: 'Tanggal Mulai',
      key: 'dateFrom',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: 'Tanggal Selesai',
      key: 'dateTo',
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
