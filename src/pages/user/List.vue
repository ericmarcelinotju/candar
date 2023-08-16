<template>
  <DefaultPage :title="$t('app.columns.user')">
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
      <template #role="{ item }">
        <span>{{ item.role.name }}</span>
      </template>
      <template #last_login="{ item }">
        <span>{{ item.last_login }}</span>
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
      <button>
        <CogIcon
          class="w-5 h-5 text-gray-500"
          @click="() => (visibleFieldConfigModal = true)"
        />
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
    <DefaultModal
      v-model="visibleFieldConfigModal"
      description="Please choose the item shown in the list:"
      :has-cancel="false"
      :has-icon="false"
      title="Edit List Options"
      type="info"
      @confirm="onConfirmFieldConfig"
    >
      <div class="mt-6 grid grid-cols-3 gap-4">
        <div
          v-for="field in columns.filter((field) => field.editable !== false)"
          :key="field"
          class="flex field"
        >
          <input
            :id="field.key"
            ref="visibleCheckboxRefs"
            :checked="!field.hidden"
            class="default-checkbox"
            type="checkbox"
          >
          <label
            class="default-label"
            :for="field.key"
          >
            {{ field.label }}
          </label>
        </div>
      </div>
      <template #action>
        <button
          class="default-button mr-6"
          type="button"
          @click="setDefaultFields"
        >
          {{ $t("app.set_default") }}
        </button>
      </template>
    </DefaultModal>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CogIcon, PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getUsers, del as deleteUser } from '@/api/user'
import { get as getRoles } from '@/api/role'
import { useNotify } from '@/composables/use-notify'
import { User } from '@/typings/models/user.type'
import { userCreate, userEdit } from '@/router/routes/user'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('user')

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<User[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getUsers(params)
    .then(res => {
      // TODO :: Filter by level
      // const currUser = store.getters['auth/user']
      // items.value = res.data.users.filter(user => user.role.level >= currUser.level)
      items.value = res.data.users
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(userCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...userEdit, params: { id } })
}

// Delete user
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<User> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteUser(id)
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

const initSearchOptions = () => {
  if (hasPermission('GET', 'ROLE')) {
    getRoles()
      .then(res => {
        const roleColumn = columns.find(column => column.key === 'role_id')
        roleColumn.options = res.data.roles.map(role => ({ label: role.name, value: role.id }))
      })
  }
}

onMounted(() => {
  initSearchOptions()
})

// Table columns setting
const copyColumns = [...store.getters['columns/user']]
const columns = reactive(copyColumns)
const visibleCheckboxRefs = ref([])
const visibleFieldConfigModal = ref(false)
const onConfirmFieldConfig = () => {
  for (const checkbox of visibleCheckboxRefs.value) {
    const field = columns.find((field) => field.value === checkbox.id)
    field.hidden = !checkbox.checked
  }
  store.commit('columns/setUser', columns)
}
const setDefaultFields = () => {
  store.commit('columns/setDefaultUser')
  Object.assign(columns, [...store.getters['columns/user']])
}

const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
</script>
