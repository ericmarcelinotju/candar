<template>
  <DefaultPage title="Log">
    <template #table>
      <DefaultTable
        :columns="columns"
        :has-delete="false"
        :has-edit="false"
        :items="items"
        :loading="loading"
        :total="itemsTotal"
        @search="handleSearch"
      >
        <template #level="{ item }">
          <span :class="`${item.level}-tag`">
            {{ item.level }}
          </span>
        </template>
        <template #type="{ item }">
          <span class="default-tag">
            {{ item.type }}
          </span>
        </template>
        <template #content="{ item }">
          <a
            class="content"
            @click="handleDetail(item)"
          >
            <EyeIcon class="h-6 w-6 mr-1" />
          </a>
        </template>
      </DefaultTable>
    </template>
    <template #dialog>
      <DefaultModal
        v-model="visibleDeleteConfirmationModal"
        :loading="loadingDelete"
        type="danger"
        @confirm="confirmDelete"
      />
      <DefaultModal
        v-model="visibleDetailConfirmationModal"
        :description="detailItem.subject"
        :has-cancel="false"
        :title="detailItem.title"
        :type="detailItem.level"
      >
        <div
          class="mt-4"
          v-html="detailItem.content"
        />
      </DefaultModal>
    </template>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { EyeIcon } from '@heroicons/vue/solid'
import { get as getLogs, del as deleteLog } from '@/api/log'
import { useNotify } from '@/composables/use-notify'
import { Log } from '@/typings/models/log.type'

const route = useRoute()
const { notify } = useNotify('log')

const columns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Time',
    key: 'created_at',
    isSortable: true
  },
  {
    label: 'Level',
    key: 'level',
    isSortable: true
  },
  {
    label: 'Title',
    key: 'title',
    isSortable: true
  },
  {
    label: 'Subject',
    key: 'subject'
  },
  {
    label: 'Content',
    key: 'content',
    class: 'action'
  },
  {
    label: 'Type',
    key: 'type',
    isSortable: true,
    isHidden: true
  }
]

const loading = ref(false)
let stateParams = reactive({})
const items = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getLogs({
    ...params,
    type: route.meta.type
  })
    .then(res => {
      items.value = res.data.logs
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}
watch(() => route.meta.type, () => {
  handleSearch(stateParams)
})

const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Log> = ref(null)

const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteLog(id)
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

const visibleDetailConfirmationModal = ref(false)
const detailItem: Ref<Log> = ref(null)
const handleDetail = (data: Log) => {
  visibleDetailConfirmationModal.value = true
  detailItem.value = data
}
</script>
