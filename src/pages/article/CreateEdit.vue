<template>
  <DefaultPage :title="$t('app.columns.article')">
    <div
      v-if="loading"
      class="w-full h-full flex justify-center items-center"
    >
      <Loading class="h-12 w-12" />
    </div>
    <DefaultCreateEdit
      v-else
      :form-settings="formSettings"
      :initial-data="initialData"
      @submit="onSubmit"
    />
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getArticle,
  insert as insertArticle,
  update as updateArticle
} from '@/api/article'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Article } from '@/typings/models/article.type'
import { articleList } from '@/router/routes/article'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('article')

const initialData: Ref<Article> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getArticle(id)
    .then(res => {
      initialData.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  if (id) {
    return updateArticle(id, { ...form.value })
      .then(() => {
        router.push(articleList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertArticle({ ...form.value })
      .then(() => {
        router.push(articleList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

onMounted(() => {
  initPage()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'content',
      label: 'Content',
      isRequired: true,
      type: 'textarea'
    },
    {
      key: 'test',
      label: 'Test',
      type: 'date'
    }
  ]
}
initForm()
</script>
