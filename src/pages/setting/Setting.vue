<template>
  <DefaultPage
    :has-back="false"
    :title="$t('columns.setting')"
  >
    <div class="h-full flex flex-col justify-between mt-2">
      <DefaultTabs
        v-if="!formLoading"
        :options="[
          { label: 'General', value: 'general' },
          { label: 'Document', value: 'document' },
        ]"
      >
        <template #general>
          <div class="grid grid-cols-12 gap-6 px-4 py-5">
            <div class="col-span-12 text-info text-xl font-bold">
              Company
              <hr class="mt-2 border-info">
            </div>
            <div class="col-span-12 mt-2">
              <label
                class="default-label"
                for="smtp_host"
              >
                Name
              </label>
              <input
                id="company_name"
                v-model="form.companyName"
                class="default-input"
                required
                type="text"
              >
            </div>
            <div class="col-span-12 mt-2">
              <label
                class="default-label"
                for="smtp_host"
              >
                Address
              </label>
              <textarea
                id="company_address"
                v-model="form.companyAddress"
                class="default-input"
                required
              />
            </div>
          </div>
        </template>
        <template #document>
          <div class="grid grid-cols-12 gap-6 px-4 py-5">
            <div class="col-span-12 text-info text-xl font-bold">
              Quotation
              <hr class="mt-2 border-info">
            </div>
            <div class="col-span-6">
              <label
                class="default-label"
                for="quotation_header_logo_1"
              >
                Header Logo 1
              </label>
              <input
                id="quotation_header_logo_1"
                v-model="form.quotationHeaderLogo1"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-6">
              <label
                class="default-label"
                for="quotation_header_logo_2"
              >
                Header Logo 2
              </label>
              <input
                id="quotation_header_logo_2"
                v-model="form.quotationHeaderLogo2"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-12">
              <label
                class="default-label"
                for="quotation_signature_logo"
              >
                Signature Logo
              </label>
              <input
                id="quotation_signature_logo"
                v-model="form.quotationSignatureLogo"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-6">
              <label
                class="default-label"
                for="quotation_footer_logo_1"
              >
                Footer Logo 1
              </label>
              <input
                id="quotation_footer_logo_1"
                v-model="form.quotationFooterLogo1"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-6">
              <label
                class="default-label"
                for="quotation_footer_logo_2"
              >
                Footer Logo 2
              </label>
              <input
                id="quotation_footer_logo_2"
                v-model="form.quotationFooterLogo2"
                class="default-input"
                required
                type="text"
              >
            </div>
          </div>
        </template>
      </DefaultTabs>
      <div class="create-edit-submit-container">
        <button
          class="default-button mr-4"
          type="reset"
          @click.prevent="reset"
        >
          {{ $t("app.reset") }}
        </button>
        <button
          class="success-button"
          :disabled="saveLoading"
          type="submit"
          @click.prevent="submit"
        >
          <Loading v-if="saveLoading" />
          {{ $t("app.save") }}
        </button>
      </div>
    </div>
  </DefaultPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  get as getSettings,
  save as saveSettings
} from '@/api/setting'
import DefaultTabs from '@/components/default/Tabs.vue'
import { useForm } from '@/composables/use-form'
import { useNotify } from '@/composables/use-notify'
import { AppSetting } from '@/typings/models/setting.type'

const { form } = useForm<AppSetting>()
const { notify } = useNotify('setting')

const formLoading = ref(true)
const saveLoading = ref(false)

const initPage = () => {
  getSettings()
    .then(resp => {
      form.value = resp
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      formLoading.value = false
    })
}

const reset = () => {
  // TODO :: Reset
}

const submit = async () => {
  saveLoading.value = true

  saveSettings(form.value)
    .then(() => {
      notify('save')
    })
    .catch(() => {
      notify('save', 'danger')
    })
    .finally(() => {
      saveLoading.value = false
    })
}

onMounted(() => {
  initPage()
})
</script>
