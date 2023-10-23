<template>
  <div>
    <DefaultPage :title="$t('app.columns.variant')">
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
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getVariant,
  insert as insertVariant,
  update as updateVariant
} from '@/api/variant'
import {
  get as getVariantCategory
} from '@/api/variant-category'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Variant, VariantCategory } from '@/typings/models/variant.type'
import { variantList } from '@/router/routes/variant'
import { Option } from '@/typings/option.type'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const variantCategories: Ref<VariantCategory[]> = ref([])
const variantCategoryOptions: Ref<Option[]> = computed(() => variantCategories.value.map(variantCategory => ({ label: variantCategory.name, value: variantCategory.id })))

const { notify } = useNotify('variant')

const initialData: Ref<Variant> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initOptions = async () => {
  getVariantCategory()
    .then(res => {
      variantCategories.value = res.data.data
      initForm()
    })
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getVariant(id)
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
    ...form.value,
    code: 'VA'
  }
  if (id) {
    return updateVariant(id, payload)
      .then(() => {
        router.push(variantList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertVariant(payload)
      .then(() => {
        router.push(variantList)
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
      label: 'Name',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'code',
      label: 'Code',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'categoryId',
      label: 'Variant Category',
      isRequired: true,
      type: 'dropdown',
      options: variantCategoryOptions.value
    }

  ]
}
const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
initForm()
</script>
