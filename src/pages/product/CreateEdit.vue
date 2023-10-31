<template>
  <div>
    <DefaultPage :title="$t('app.columns.product')">
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
  detail as getProduct,
  insert as insertProduct,
  update as updateProduct
} from '@/api/product'
import {
  get as getProductCategory
} from '@/api/product-category'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Product, ProductCategory } from '@/typings/models/product.type'
import { variantList } from '@/router/routes/variant'
import { Option } from '@/typings/option.type'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const productCategories: Ref<ProductCategory[]> = ref([])
const productCategoryOptions: Ref<Option[]> = computed(() => productCategories.value.map(productCategory => ({ label: productCategory.name, value: productCategory.id })))

const { notify } = useNotify('product')

const initialData: Ref<Product> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initOptions = async () => {
  getProductCategory()
    .then(res => {
      productCategories.value = res.data.data
      initForm()
    })
  initForm()
}

const initPage = () => {
  if (!id) return
  loading.value = true
  getProduct(id)
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
    coordinates: [form.coord_x, form.coord_y]
  }
  if (id) {
    return updateProduct(id, payload)
      .then(() => {
        router.push(variantList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertProduct(payload)
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
      key: 'stock',
      label: 'Stock',
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
      key: 'categoryId',
      label: 'Product Category',
      isRequired: true,
      type: 'dropdown',
      options: productCategoryOptions.value
    }

  ]
}
const hasPermission = (method, module = 'USER') => {
  return store.getters['auth/hasPermission'](module, method)
}
initForm()
</script>
