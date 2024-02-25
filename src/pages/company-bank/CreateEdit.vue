<template>
  <div>
    <DefaultPage :title="$t('app.columns.company_bank')">
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
import { useI18n } from 'vue-i18n'
import { useNotify } from '@/composables/use-notify'
import { required } from '@/utils/validation'
import { companyBankList } from '@/router/routes/company-bank'
import { CompanyBank } from '@/typings/models/company-bank.type'

import { get as getBankList } from '@/api/bank'
import {
  insert as insertCompanyBank,
  update as updateCompanyBank,
  detail as getCompanyBankDetail
} from '@/api/company-bank'

import { FormSetting } from '@/typings/form.type'
import { Option } from '@/typings/option.type'

import DefaultCreateEdit from '@/components/default/CreateEdit.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { notify } = useNotify('companyBank')

const initialData: Ref<CompanyBank> = ref(new CompanyBank())
const banks: Ref<Option[]> = ref([])
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const isEdit = computed(() => !!route.params.id)

const formSettings: Ref<FormSetting[]> = ref([])

const initPage = async () => {
  loading.value = true

  try {
    if (isEdit.value) {
      const resp = await getCompanyBankDetail(id)

      initialData.value = { ...resp.data } as CompanyBank
      initialData.value.bankId = resp.data?.bank?.id
    }
  } catch (error) {
    notify('loaded', 'danger')
  } finally {
    loading.value = false
  }
}

const onSubmit = (form, onFinish) => {
  const payload = {
    ...form.value
  }

  if (isEdit.value) {
    return updateCompanyBank(id, payload)
      .then(() => {
        router.push(companyBankList)
        notify('updated')
      })
      .catch((err) => {
        notify('updated', 'danger', err.message)
      })
      .finally(onFinish)
  } else {
    return insertCompanyBank(payload)
      .then(() => {
        router.push(companyBankList)
        notify('inserted')
      })
      .catch(() => {
        notify('inserted', 'danger')
      })
      .finally(onFinish)
  }
}

const initOptions = async () => {
  getBankList().then((result) => {
    banks.value = result.data.data.map((bank) => {
      return {
        value: bank.id,
        label: bank.name
      }
    })
  })
}

const initForm = () => {
  formSettings.value = [
    {
      key: 'bankId',
      label: t('app.columns.account.bank'),
      isRequired: true,
      type: 'dropdown',
      col: 6,
      options: banks
    },
    {
      key: 'bankSwiftCode',
      label: t('app.columns.bank.swift_code'),
      isRequired: true,
      rules: [required],
      type: 'number',
      col: 6
    },
    {
      key: 'bankAddress',
      label: t('app.columns.bank.address'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'accountNumber',
      label: t('app.columns.account.number'),
      isRequired: true,
      type: 'number',
      rules: [required]
    },
    {
      key: 'accountName',
      label: t('app.columns.account.name'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'accountAddress',
      label: t('app.columns.account.address'),
      isRequired: true,
      rules: [required]
    },
    {
      key: 'active',
      label: t('app.columns.account.active'),
      type: 'checkbox'
    }
  ]
}

onMounted(() => {
  initPage()
  initOptions()
})

initForm()
</script>

<style scoped></style>
