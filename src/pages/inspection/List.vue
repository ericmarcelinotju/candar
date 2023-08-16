<template>
  <DefaultPage :title="$t('app.columns.inspection')">
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
      <template #action="{ item }">
        <!-- TODO :: permission access inspection -->
        <a
          class="detail mr-2"
          @click="handleDetail(item)"
        >
          <EyeIcon class="h-6 w-6 mr-1" />
        </a>
      </template>
      <template #date="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template #created_by="{ item }">
        {{ item.created_by.username }}
      </template>
      <template #repeat="{ item }">
        <!-- TODO :: process display frequency, and interval -->
        {{ item.frequency }}
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
import dayjs from 'dayjs'
import { PlusIcon, EyeIcon } from '@heroicons/vue/solid'
import {
  get as getInspection,
  del as deleteInspection
} from '@/api/inspection'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { inspectionCreate, inspectionEdit, inspectionDetail } from '@/router/routes/inspection'
import { Role } from '@/typings/models/role.type'
import { Inspection } from '@/typings/models/inspection.type'

const router = useRouter()
const { notify } = useNotify('inspection')

const columns = [
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
    isSearchable: true
  },
  {
    label: 'Repeat ?',
    key: 'repeat'
  },
  {
    label: 'Created By',
    key: 'created_by',
    isSortable: true,
    isSearchable: true
  }
]

const loading = ref(false)
let stateParams = reactive({})
const items: Ref<Inspection[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getInspection(params)
    .then(res => {
      items.value = res.data.inspections
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(inspectionCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...inspectionEdit, params: { id } })
}

const handleDetail = ({ id }) => {
  router.push({ ...inspectionDetail, params: { id } })
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
  deleteInspection(id)
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
  return true
  // TODO uncomment later
  // return store.getters['auth/hasPermission']('INSPECTION', method)
}

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}
</script>
