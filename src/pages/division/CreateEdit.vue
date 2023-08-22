<template>
  <DefaultPage :title="$t('app.columns.division')">
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
  detail as getDivision,
  insert as insertDivision,
  update as updateDivision
} from '@/api/division'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Division } from '@/typings/models/division.type'
import { divisionList } from '@/router/routes/division'

const route = useRoute()
const router = useRouter()

const { notify } = useNotify('division')

const initialData: Ref<Division> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initOptions = async () => {
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getDivision(id)
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
    return updateDivision(id, { ...form.value })
      .then(() => {
        router.push(divisionList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertDivision({ ...form.value })
      .then(() => {
        router.push(divisionList)
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
  initOptions()
})

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
    }
  ]
}
initForm()
</script>
