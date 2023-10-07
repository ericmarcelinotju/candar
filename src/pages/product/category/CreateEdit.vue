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
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  detail as getProductCategory,
  insert as insertProductCategory,
  update as updateProductCategory
} from '@/api/product-category'

import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { ProductCategory } from '@/typings/models/product.type'
import { productCategoryList } from '@/router/routes/product'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('variant')

const initialData: Ref<ProductCategory> = ref()
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
  getProductCategory(id)
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
    return updateProductCategory(id, payload)
      .then(() => {
        router.push(productCategoryList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertProductCategory(payload)
      .then(() => {
        router.push(productCategoryList)
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
      key: 'code',
      label: 'Code',
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
      key: 'description',
      label: 'Description',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'cost',
      label: 'Cost',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'price',
      label: 'Price',
      isRequired: true,
      rules: [required]
    },
    {
      key: 'stock',
      label: 'Stock',
      isRequired: true,
      rules: [required]
    }

  ]
}
const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
initForm()
</script>
