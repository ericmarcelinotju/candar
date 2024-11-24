<template>
  <DefaultPage :title="$t('module.purchase')">
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
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import { get as getPurchases, del as deletePurchase } from '@/api/purchase'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { purchaseCreate } from '@/router/routes/purchase'
import { Purchase } from '@/typings/models/purchase.type'

const { t } = useI18n()

const router = useRouter()
const store = useStore()

const { notify } = useNotify('purchase')

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
    label: t('app.columns.id'),
    key: 'id',
    isHidden: true
  },
  {
    label: t('app.columns.date'),
    key: 'date',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.code'),
    key: 'code',
    isSortable: true,
    isSearchable: true
  },

  {
    label: t('app.columns.vendor'),
    key: 'vendor',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.note'),
    key: 'note',
    isSortable: true,
    isSearchable: true
  }
]
const hasPermission = (method, module = 'PURCHASE') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
