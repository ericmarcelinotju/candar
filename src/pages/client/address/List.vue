<template>
  <DefaultPage
    class="!pt-0"
    :title="$t('app.columns.clientAddress')"
  >
    <DefaultTable
      :columns="columns"
      :has-delete="hasPermission('DELETE')"
      :has-edit="hasPermission('PUT')"
      :has-pagination="false"
      :items="items"
      :loading="loading"
      :total="itemsTotal"
      @delete="handleDelete"
      @edit="handleEdit"
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
import { Ref, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { del as deleteClient } from '@/api/client-address'
import { useNotify } from '@/composables/use-notify'
import { ClientAddress } from '@/typings/models/client.type'
import { clientCreate, clientEdit } from '@/router/routes/client'

interface Props {
  items: ClientAddress[]
}

const props = defineProps<Props>()

const router = useRouter()
const store = useStore()
const { notify } = useNotify('client address')

const loading = ref(false)

const itemsTotal = computed(() => props.items.length)

const handleCreate = () => {
  router.push(clientCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...clientEdit, params: { id } })
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<ClientAddress> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteClient(id)
    .then(() => {
      // TODO :: refresh list
      // handleSearch(stateParams)
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
    label: 'Name',
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Province',
    key: 'province',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'City',
    key: 'city',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'District',
    key: 'district',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Sub District',
    key: 'sub_district',
    isSortable: true,
    isSearchable: true
  }
]

const hasPermission = (method, module = 'CLIENT') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
