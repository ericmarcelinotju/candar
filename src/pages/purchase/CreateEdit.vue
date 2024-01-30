<template>
  <div>
    <DefaultPage :title="$t('module.purchase')">
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
      >
        <template #products="{ form }">
          <ProductForm
            v-for="(purchaseProduct, index) in form.purchaseProducts"
            :key="purchaseProduct.id"
            v-model="form.purchaseProducts[index]"
            :index="index"
            :products="products"
            @delete="(index) => handleRemoveProduct(form, index)"
          />
          <button
            class="info-button"
            type="button"
            @click="handleAddProduct(form)"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Product
          </button>
        </template>
      </DefaultCreateEdit>
    </DefaultPage>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/solid'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import { detail as getPurchase, insert as insertPurchase } from '@/api/purchase'
import { get as getProducts } from '@/api/product'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Purchase, PurchaseProduct } from '@/typings/models/purchase.type'
import { purchaseList } from '@/router/routes/purchase'
import { Product } from '@/typings/models/product.type'
import ProductForm from './ProductForm.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { notify } = useNotify('purchase')

const initialData: Ref<Purchase> = ref(new Purchase())
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const onSubmit = (form, onFinish) => {
  const payload = {
    ...form.value
  }

  return insertPurchase(payload)
    .then(() => {
      router.push(purchaseList)
      notify('inserted')
    })
    .catch(() => {
      notify('inserted', 'danger')
    })
    .finally(onFinish)
}

const products: Ref<Product[]> = ref([])

const initPage = async () => {
  loading.value = true
  try {
    await getProducts().then((res) => {
      products.value = res.data.data
    })
    if (id) {
      const resp = await getPurchase(id)
      initialData.value = resp.data
    } else {
      console.log(initialData.value)
      handleAddProduct(initialData.value)
    }

    initialData.value.date = new Date()

    initForm()
  } catch (err) {
    console.error(err)
    notify('loaded', 'danger')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initPage()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: t('app.columns.code'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'vendor',
      label: t('app.columns.vendor'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'date',
      label: t('app.columns.date'),
      isRequired: true,
      type: 'date',
      rules: [required]
    },
    {
      key: 'note',
      label: t('app.columns.note'),
      type: 'textarea'
    },
    {
      key: 'products',
      label: t('app.columns.products')
    }
  ]
}
initForm()

const handleAddProduct = (form: Purchase) => {
  if (!form.purchaseProducts) {
    form.purchaseProducts = []
  }
  const purchaseProduct = new PurchaseProduct()
  purchaseProduct.quantity = 1
  form.purchaseProducts.push(purchaseProduct)
}

const handleRemoveProduct = (form: Purchase, index: number) => {
  form.purchaseProducts.splice(index, 1)
}
</script>
