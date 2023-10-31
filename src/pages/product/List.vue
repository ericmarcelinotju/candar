<template>
  <DefaultPage :title="$t('app.columns.product')">
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
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getProducts, del as deleteProduct } from '@/api/product'
import { useNotify } from '@/composables/use-notify'
import { Product } from '@/typings/models/product.type'
import { productCreate, productEdit } from '@/router/routes/product'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('variant')

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
      itemsTotal.value = res.data.total_item
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
    label: 'Name',
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Cost',
    key: 'cost',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Price',
    key: 'price',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Category',
    key: 'category.name',
    isSortable: false,
    isSearchable: false
  }
]

const hasPermission = (method, module = 'CLIENT') => {
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
