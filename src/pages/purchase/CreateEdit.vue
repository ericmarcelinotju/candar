<template>
  <div>
    <DefaultPage :title="$t('app.columns.purchase')">
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
  detail as getPurchase,
  insert as insertPurchase
} from '@/api/purchase'
import { required } from '@/utils/validation'
import { FormSetting } from '@/typings/form.type'
import { useStore } from 'vuex'
import { Purchase } from '@/typings/models/purchase.type'
import { purchaseList } from '@/router/routes/purchase'

const route = useRoute()
const router = useRouter()
const store = useStore()

const { notify } = useNotify('purchase')

const initialData: Ref<Purchase> = ref()
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

onMounted(() => {
  initForm()
})

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: 'Code',
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
