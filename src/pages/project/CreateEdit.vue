<template>
  <DefaultPage :title="$t('app.columns.project')">
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
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getProject,
  insert as insertProject,
  update as updateProject
} from '@/api/project'
import { get as getClient } from '@/api/client'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Client } from '@/typings/models/client.type'
import { Project } from '@/typings/models/project.type'
import { projectList } from '@/router/routes/project'
import { Option } from '@/typings/option.type'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('project')

const initialData: Ref<Project> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const clients: Ref<Client[]> = ref([])
const clientOptions: Ref<Option[]> = computed(() => clients.value.map(client => ({ label: client.name, value: client.id })))

const initPage = () => {
  if (!id) return
  loading.value = true
  getProject(id)
    .then(res => {
      initialData.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
  if (hasPermission('GET', 'CLIENT')) {
    getClient()
      .then(res => {
        clients.value = res.data.clients
        initForm()
      })
  }
}

const onSubmit = (form, onFinish) => {
  if (id) {
    return updateProject(id, { ...form.value })
      .then(() => {
        router.push(projectList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertProject({ ...form.value })
      .then(() => {
        router.push(projectList)
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

const hasPermission = (method, module = 'PROJECT') => {
  return store.getters['auth/hasPermission'](module, method)
}

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'number',
      label: 'Number',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'name',
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'source',
      label: 'Source',
      options: [
        {
          label: 'Call',
          value: 'Call'
        },
        {
          label: 'Advertisement',
          value: 'Advertisement'
        },
        {
          label: 'Referal',
          value: 'Referal'
        },
        {
          label: 'Partner',
          value: 'Partner'
        },
        {
          label: 'Public Relations',
          value: 'Public Relations'
        },
        {
          label: 'Web',
          value: 'Web'
        },
        {
          label: 'Other',
          value: 'Other'
        }
      ]
    },
    {
      key: 'client_id',
      label: 'Client',
      isRequired: true,
      type: 'dropdown',
      options: clientOptions.value
    }
  ]
}
initForm()
</script>
