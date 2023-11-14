<template>
  <DefaultPage :title="$t('app.columns.purchase')">
    <DefaultTable
      :columns="columns"
      :has-delete="hasPermission('DELETE')"
      :has-edit="false"
      :items="items"
      :loading="loading"
      :total="itemsTotal"
      @delete="handleDelete"
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
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getPurchases, del as deletePurchase } from '@/api/purchase'
import { useNotify } from '@/composables/use-notify'
import { purchaseCreate, purchaseEdit } from '@/router/routes/purchase'
import { useStore } from 'vuex'
import { Purchase } from '@/typings/models/purchase.type'

const router = useRouter()
const store = useStore()

const { notify } = useNotify('variant-option')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Purchase[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getPurchases(params)
    .then((res) => {
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(purchaseCreate)
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Purchase> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deletePurchase(id)
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
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Date',
    key: 'date',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Code',
    key: 'code',
    isSortable: true,
    isSearchable: true
  },

  {
    label: 'Vendor',
    key: 'vendor',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Note',
    key: 'note',
    isSortable: true,
    isSearchable: true
  }
]
const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
