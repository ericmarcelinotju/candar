<template>
  <DefaultPage :title="$t('app.module.article')">
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
      <template #content="{ item }">
        <p v-html="item.content" />
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
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getArticles, del as deleteArticle } from '@/api/article'
import { useNotify } from '@/composables/use-notify'
import { Article } from '@/typings/models/article.type'
import { articleCreate, articleEdit } from '@/router/routes/article'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('article')

const columns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Name',
    key: 'name',
    isSearchable: true,
    isSortable: true
  },
  {
    label: 'Content',
    key: 'content'
  }
]

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Article[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getArticles(params)
    .then(res => {
      items.value = res.data.articles
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(articleCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...articleEdit, params: { id } })
}

// Delete article
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Article> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteArticle(id)
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

const hasPermission = (method, module = 'DEVICE') => {
  return store.getters['auth/hasPermission'](module, method)
}

</script>
