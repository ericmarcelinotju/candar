<template>
  <DefaultPage :title="$t('module.product')">
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
      <template #name="{ item }">
        <span class="uppercase">{{ item.name }}</span>
      </template>
    </DefaultTable>
    <template #action>
      <FileMenu
        class="mr-6"
        @import="handleImport"
      />
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
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/solid'
import { get as getProducts, del as deleteProduct } from '@/api/product'
import FileMenu from '@/components/FileMenu.vue'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { Product } from '@/typings/models/product.type'
import { productCreate, productEdit } from '@/router/routes/product/product'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const { notify } = useNotify('product')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Product[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getProducts(params)
    .then((res) => {
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(productCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...productEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Product> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteProduct(id)
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
    label: t('app.columns.sku'),
    key: 'sku',
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
    label: t('app.columns.stock'),
    key: 'stock',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.cost'),
    key: 'cost',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.price'),
    key: 'price',
    isSortable: true,
    isSearchable: true
  },
  {
    label: t('app.columns.publish_price'),
    key: 'publishPrice',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.category'),
    key: 'category.name',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.batch_number'),
    key: 'batchNumber',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.entry_date'),
    key: 'entryDate',
    isSortable: false,
    isSearchable: false
  },
  {
    label: t('app.columns.expired_date'),
    key: 'expDate',
    isSortable: false,
    isSearchable: false
  }
]

const handleImport = () => {
  router.push({ name: 'product-import' })
}

const hasPermission = (method, module = 'PRODUCT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>

<style lang="scss" scoped>
.head {
  @apply px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap;

  &.action {
    @apply text-center w-1;
  }
}
</style>
