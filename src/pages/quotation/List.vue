<template>
  <DefaultPage :title="$t('module.quotation')">
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
      <template #revision="{ item }">
        v{{ item.revision + 1 }}.0
      </template>
      <template #status="{ item }">
        <template v-if="item.status == 'draft'">
          <span
            v-if="isManager"
            class="default-tag mr-3 !py-1"
            type="button"
          >
            {{ $t('quotation.draft') }}
          </span>
          <button
            v-else
            class="default-button mr-3 !py-1 !px-2 text-xs"
            type="button"
            @click="handleSend(item)"
          >
            {{ $t('quotation.send') }}
          </button>
        </template>
        <template v-else-if="item.status == 'sent'">
          <button
            v-if="isManager"
            class="warning-button mr-3 !py-1 !px-2 text-xs"
            type="button"
            @click="handleApprove(item)"
          >
            {{ $t('quotation.approve') }}
          </button>
          <span
            v-else
            class="warning-tag mr-3 !py-1"
            type="button"
          >
            {{ $t('quotation.wait_approve') }}
          </span>
        </template>
        <template v-else-if="item.status == 'approved'">
          <span
            v-if="isManager"
            class="info-tag mr-3 !py-1"
          >
            {{ $t('quotation.wait_accept') }}
          </span>
          <button
            v-else
            class="info-button mr-3 !py-1 !px-2 text-xs"
            type="button"
            @click="handleAccept(item)"
          >
            {{ $t('quotation.upload') }}
          </button>
        </template>
        <button
          v-if="item.status == 'accepted'"
          class="success-button mr-3 !py-1 !px-2 text-xs"
          type="button"
          @click="handleViewApproval(item)"
        >
          {{ $t('quotation.accepted') }}
        </button>
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
        v-model="visibleSendConfirmationModal"
        description="Make sure the quotation is correct as this action may cannot be undone."
        :loading="loadingSend"
        title="Send Quotation for Approval?"
        type="info"
        @confirm="confirmSend"
      />
      <DefaultModal
        v-model="visibleApproveConfirmationModal"
        description="Make sure the quotation is correct as this action may cannot be undone."
        :loading="loadingApprove"
        title="Approve Quotation?"
        type="info"
        @confirm="confirmApprove"
      />
      <DefaultModal
        v-model="visibleAcceptConfirmationModal"
        description="Make sure the attachment is correct as this action may cannot be undone."
        :loading="loadingAccept"
        title="Accept Quotation?"
        type="info"
        @confirm="confirmAccept"
      >
        <FileInput
          v-model="acceptItem.approvalAttachment"
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
            download
            :href="`${config.apiAddress}\\${viewApprovalItem.approvalAttachment}`"
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
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/solid'
import { config } from '@/config'
import DefaultTable from '@/components/default/Table.vue'
import FileInput from '@/components/form/File.vue'
import {
  get as getQuotations,
  del as deleteQuotation,
  send as sendQuotation,
  approve as approveQuotation,
  accept as acceptQuotation
} from '@/api/quotation'
import { get as getProjects } from '@/api/project'
import { useNotify } from '@/composables/use-notify'
import { Quotation } from '@/typings/models/quotation.type'
import { quotationCreate, quotationEdit } from '@/router/routes/quotation'
import { TableColumn } from '@/typings/table.type'
import { Project } from '@/typings/models/project.type'
import { Option } from '@/typings/option.type'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const { notify } = useNotify('variant')

const isManager = computed(() => store.getters['auth/isManager'])

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
      itemsTotal.value = res.data.totalItem
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

// Send to be approved
const loadingSend = ref(false)
const visibleSendConfirmationModal = ref(false)
const sendItem: Ref<Quotation> = ref()
const handleSend = (data: Quotation) => {
  visibleSendConfirmationModal.value = true
  sendItem.value = data
}
const confirmSend = () => {
  const { id } = sendItem.value
  loadingSend.value = true
  sendQuotation(id)
    .then(() => {
      handleSearch(stateParams)
      notify('sent')
    })
    .catch(() => {
      notify('sent', 'danger')
    })
    .finally(() => {
      loadingSend.value = false
      visibleSendConfirmationModal.value = false
    })
}

// Approve by manager
const loadingApprove = ref(false)
const visibleApproveConfirmationModal = ref(false)
const approveItem: Ref<Quotation> = ref()
const handleApprove = (data) => {
  visibleApproveConfirmationModal.value = true
  approveItem.value = data
}
const confirmApprove = () => {
  const { id } = approveItem.value
  loadingApprove.value = true
  approveQuotation(id)
    .then(() => {
      handleSearch(stateParams)
      notify('approved')
    })
    .catch(() => {
      notify('approved', 'danger')
    })
    .finally(() => {
      loadingApprove.value = false
      visibleApproveConfirmationModal.value = false
    })
}

// Accept by client
const loadingAccept = ref(false)
const visibleAcceptConfirmationModal = ref(false)
const acceptItem: Ref<Quotation> = ref()
const handleAccept = (data) => {
  visibleAcceptConfirmationModal.value = true
  acceptItem.value = data
}
const confirmAccept = () => {
  const { id } = acceptItem.value
  loadingAccept.value = true

  const payload = new FormData()
  payload.append('attachment', acceptItem.value.approvalAttachment)

  acceptQuotation(id, payload)
    .then(() => {
      handleSearch(stateParams)
      notify('approved')
    })
    .catch(() => {
      notify('approved', 'danger')
    })
    .finally(() => {
      loadingAccept.value = false
      visibleAcceptConfirmationModal.value = false
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
      label: t('app.columns.date_from'),
      key: 'dateFromDisplay',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: t('app.columns.date_to'),
      key: 'dateToDisplay',
      isSortable: true,
      isSearchable: true,
      searchType: 'date'
    },
    {
      label: t('app.columns.project'),
      key: 'project_id',
      isSearchable: true,
      searchType: 'dropdown',
      searchOptions: projectOptions.value
    },
    {
      label: t('app.columns.version'),
      key: 'revision'
    },
    {
      label: t('app.columns.status'),
      key: 'status',
      isSearchable: true,
      searchType: 'dropdown',
      searchOptions: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Approved', value: 'approved' },
        { label: 'Accepted', value: 'accept' }
      ]
    }
  ]
}
initColumns()

const hasPermission = (method, module = 'QUOTATION') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
