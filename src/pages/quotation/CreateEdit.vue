<template>
  <DefaultPage :title="$t('module.quotation')">
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
          v-for="(quotationProduct, index) in form.quotationProducts"
          :key="quotationProduct.id"
          v-model="form.quotationProducts[index]"
          :has-contract="hasContract(form.projectId)"
          :index="index"
          :products="products"
          :tiers="productTiers"
          @delete="(index) => handleRemoveProduct(form, index)"
        />
        <button
          class="info-button"
          type="button"
          @click="handleAddProduct(form)"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          {{ $t('quotation.add_product') }}
        </button>
      </template>
      <template #action>
        <button
          v-if="isEdit && initialData.status == 'draft' && !isManager"
          class="info-button float-left"
          type="button"
          @click="handleSend"
        >
          <Loading v-if="loadingSend" />
          {{ $t('quotation.send') }}
        </button>
        <button
          v-if="isEdit && initialData.status == 'sent' && isManager"
          class="info-button float-left"
          type="button"
          @click="handleApprove"
        >
          <Loading v-if="loadingApprove" />
          {{ $t('quotation.approve') }}
        </button>
        <!-- <button
          v-if="isEdit && initialData.status == 'approved' && isManager"
          class="info-button float-left"
          type="button"
          @click="handleAccept"
        >
          <Loading v-if="loadingAccept" />
          Approve
        </button> -->
      </template>
    </DefaultCreateEdit>
    <DefaultModal
      v-model="visibleSendConfirmationModal"
      :description="$t('tip.confirm_quotation')"
      :loading="loadingSend"
      :title="$t('quotation.send_title')"
      type="info"
      @confirm="confirmSend"
    />
    <DefaultModal
      v-model="visibleApproveConfirmationModal"
      :description="$t('tip.confirm_quotation')"
      :loading="loadingApprove"
      :title="$t('quotation.approve_title')"
      type="info"
      @confirm="confirmApprove"
    />
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { PlusIcon } from '@heroicons/vue/solid'
import { useNotify } from '@/composables/use-notify'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import {
  approve as approveQuotation,
  detail as getQuotation,
  insert as insertQuotation,
  send as sendQuotation,
  update as updateQuotation
} from '@/api/quotation'
import { get as getProjects } from '@/api/project'
import { get as getProducts } from '@/api/product'
import { get as getProductTiers } from '@/api/product-tier'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { Quotation, QuotationProduct } from '@/typings/models/quotation.type'
import { quotationList } from '@/router/routes/quotation'
import { Option } from '@/typings/option.type'
import { Project } from '@/typings/models/project.type'
import { Product } from '@/typings/models/product.type'
import { ProductTier } from '@/typings/models/product-tier.type'
import ProductForm from './ProductForm.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('quotation')

const isManager = computed(() => store.getters['auth/isManager'])

const initialData: Ref<Quotation> = ref(new Quotation())

const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}
const isEdit = computed(() => !!id)

let projectId = ''
if (typeof route.params.project_id === 'string') {
  projectId = route.params.project_id
}

const projects: Ref<Project[]> = ref([])
const projectOptions: Ref<Option[]> = computed(() =>
  projects.value.map((project) => ({
    label: project.name,
    value: project.id
  }))
)

const products: Ref<Product[]> = ref([])
const productTiers: Ref<ProductTier[]> = ref([])

const hasContract = (projectId) => {
  const currProject = projects.value.find((project) => project.id === projectId)
  return currProject ? currProject.client.haveContract : false
}

const initPage = async () => {
  loading.value = true
  try {
    await Promise.all([getProjects(), getProducts(), getProductTiers()]).then(
      (res) => {
        projects.value = res[0].data.data
        products.value = res[1].data.data
        productTiers.value = res[2].data.data
      }
    )

    if (id) {
      const resp = await getQuotation(id)
      initialData.value = resp.data
    } else {
      handleAddProduct(initialData.value)
    }

    if (projectId) {
      initialData.value.projectId = projectId
    }

    initForm()
  } catch (err) {
    console.error(err)
    notify('loaded', 'danger')
  } finally {
    loading.value = false
  }
}

const onSubmit = (form: Ref<Quotation>, onFinish: () => void) => {
  const payload = {
    ...form.value,
    quotationProducts: form.value.quotationProducts.map((f) => ({
      ...f,
      price: f.priceNumber
    }))
  } as unknown as Quotation

  if (id) {
    return updateQuotation(id, payload)
      .then(() => {
        router.push(quotationList)
        notify('updated')
      })
      .catch((err) => {
        notify('updated', 'danger', err.message)
      })
      .finally(onFinish)
  } else {
    return insertQuotation(payload)
      .then(() => {
        router.push(quotationList)
        notify('inserted')
      })
      .catch((err) => {
        notify('inserted', 'danger', err.message)
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
      key: 'code',
      label: t('app.columns.code'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'dateFrom',
      label: t('app.columns.date_from'),
      type: 'date',
      isRequired: true,
      rules: [required],
      col: 6
    },
    {
      key: 'dateTo',
      label: t('app.columns.date_to'),
      type: 'date',
      isRequired: true,
      rules: [required],
      col: 6
    },
    {
      key: 'projectId',
      label: t('app.columns.project'),
      type: 'dropdown',
      isRequired: true,
      rules: [required],
      options: projectOptions.value
    },
    {
      key: 'products',
      label: t('app.columns.products')
    }
  ]
}
initForm()

const handleAddProduct = (form) => {
  if (!form.quotationProducts) {
    form.quotationProducts = []
  }
  const quotationProduct = new QuotationProduct()
  quotationProduct.quantity = 1
  form.quotationProducts.push(quotationProduct)
}

const handleRemoveProduct = (form, index) => {
  form.quotationProducts.splice(index, 1)
}

// Send to be approved
const loadingSend = ref(false)
const visibleSendConfirmationModal = ref(false)
const handleSend = () => {
  visibleSendConfirmationModal.value = true
}
const confirmSend = () => {
  loadingSend.value = true
  sendQuotation(id)
    .then(() => {
      router.push(quotationList)
      notify('sent')
    })
    .catch(() => {
      notify('sent', 'danger')
    })
    .finally(() => {
      loadingSend.value = false
      visibleSendConfirmationModal.value = false
    })
}

// Approve by manager
const loadingApprove = ref(false)
const visibleApproveConfirmationModal = ref(false)
const approveItem: Ref<Quotation> = ref()
const handleApprove = (data) => {
  visibleApproveConfirmationModal.value = true
  approveItem.value = data
}
const confirmApprove = () => {
  const { id } = approveItem.value
  loadingApprove.value = true
  approveQuotation(id)
    .then(() => {
      router.push(quotationList)
      notify('approved')
    })
    .catch(() => {
      notify('approved', 'danger')
    })
    .finally(() => {
      loadingApprove.value = false
      visibleApproveConfirmationModal.value = false
    })
}
</script>
