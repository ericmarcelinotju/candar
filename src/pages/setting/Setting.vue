<template>
  <DefaultPage
    :has-back="false"
    :title="$t('columns.setting')"
  >
    <div class="h-full flex flex-col justify-between mt-2">
      <DefaultTabs
        v-if="!formLoading"
        :options="[
          { label: 'Integration', value: 'integration' },
          { label: 'Notification', value: 'notification' },
        ]"
      >
        <template #notification>
          <div class="grid grid-cols-12 gap-6 px-4 py-5">
            <div class="col-span-12 text-info text-xl font-bold">
              Email
              <hr class="mt-2 border-info">
            </div>
            <div class="col-span-6 mt-2">
              <label
                class="default-label"
                for="smtp_host"
              >
                {{ $t("global.smtp") }}
                {{ $t("global.host") }}
              </label>
              <input
                id="smtp_host"
                v-model="form.smtp_host"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-6 mt-2">
              <label
                class="default-label"
                for="smtp_port"
              >
                {{ $t("global.smtp") }}
                {{ $t("global.port") }}
              </label>
              <input
                id="smtp_port"
                v-model="form.smtp_port"
                class="default-input"
                required
                type="number"
              >
            </div>
            <div class="col-span-12 default-field inline">
              <label
                class="default-label !mb-0"
                for="smtp_is_use_auth"
              >
                Require authentication?
              </label>
              <input
                id="smtp_is_use_auth"
                v-model="smtpIsUseAuth"
                class="default-checkbox "
                type="checkbox"
              >
            </div>
            <template v-if="smtpIsUseAuth">
              <div class="col-span-6">
                <label
                  class="default-label"
                  for="smtp_email"
                >
                  {{ $t("global.smtp") }}
                  {{ $t("global.email") }}
                </label>
                <input
                  id="smtp_email"
                  v-model="form.smtp_email"
                  class="default-input"
                  required
                  type="text"
                >
              </div>

              <div class="col-span-6">
                <label
                  class="default-label ,"
                  for="smtp_password"
                >
                  {{ $t("global.smtp") }}
                  {{ $t("global.password") }}
                </label>
                <input
                  id="smtp_password"
                  v-model="form.smtp_password"
                  class="default-input"
                  required
                  type="password"
                >
              </div>
            </template>
            <div class="col-span-6 default-field inline">
              <button
                class="info-button"
                :disabled="testEmailLoading"
                type="submit"
                @click.prevent="testEmail"
              >
                <Loading v-if="testEmailLoading" />
                Test
              </button>
              <input
                id="test_email"
                v-model="testEmailParams.email"
                class="default-input mr-6"
                placeholder="Email"
                required
                type="text"
              >
            </div>
          </div>
        </template>
        <template #integration>
          <div class="grid grid-cols-12 gap-6 px-4 py-5">
            <div class="col-span-12 text-info text-xl font-bold">
              Apilogik
              <hr class="mt-2 border-info">
            </div>
            <div class="col-span-12">
              <label
                class="default-label"
                for="apilogik_url"
              >
                {{ $t("global.apilogik") }}
                {{ $t("global.url") }}
              </label>
              <input
                id="apilogik_url"
                v-model="form.apilogik_url"
                class="default-input"
                required
                type="text"
              >
            </div>

            <div class="col-span-12">
              <label
                class="default-label"
                for="apilogik_key"
              >
                {{ $t("global.apilogik") }}
                {{ $t("global.key") }}
              </label>
              <input
                id="apilogik_key"
                v-model="form.apilogik_key"
                class="default-input"
                required
                type="password"
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
import { onMounted, reactive, ref } from 'vue'
import {
  get as getSettings,
  save as saveSettings,
  testEmail as testEmailSetting
} from '@/api/setting'
import DefaultTabs from '@/components/default/Tabs.vue'
import { useForm } from '@/composables/use-form'
import { useNotify } from '@/composables/use-notify'
import { AppSetting } from '@/typings/models/setting.type'

const { form } = useForm<AppSetting>()
const { notify } = useNotify('setting')

const formLoading = ref(true)
const saveLoading = ref(false)

const smtpIsUseAuth = ref(false)

const initPage = () => {
  getSettings()
    .then(resp => {
      form.value = resp.data
      if (form.value.smtp_email || form.value.smtp_password) {
        smtpIsUseAuth.value = true
      }
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

const testEmailParams = reactive({
  email: null
})
const testEmailLoading = ref(false)
const testEmail = () => {
  testEmailLoading.value = true
  testEmailSetting(testEmailParams.email)
    .then(() => {
      notify('email')
    })
    .catch(() => {
      notify('email', 'danger')
    })
    .finally(() => {
      testEmailLoading.value = false
    })
}
</script>
