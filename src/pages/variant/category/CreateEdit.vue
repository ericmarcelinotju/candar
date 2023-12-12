<template>
  <div>
    <DefaultPage :title="$t('app.columns.variant_category')">
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
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getVariantCategory,
  insert as insertVariantCategory,
  update as updateVariantCategory
} from '@/api/variant-category'

import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Variant } from '@/typings/models/variant.type'
import { variantCategoryList } from '@/router/routes/variant'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { notify } = useNotify('variant category')

const initialData: Ref<Variant> = ref()
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
  getVariantCategory(id)
    .then((res) => {
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
  const payload = {
    ...form.value
  }
  if (id) {
    return updateVariantCategory(id, payload)
      .then(() => {
        router.push(variantCategoryList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertVariantCategory(payload)
      .then(() => {
        router.push(variantCategoryList)
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
      key: 'name',
      label: t('app.columns.name'),
      isRequired: true,
      rules: [required]
    }

  ]
}
initForm()
</script>
