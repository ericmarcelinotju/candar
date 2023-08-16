<template>
  <DefaultPage :title="$t('app.columns.inspection')">
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
      <template #devices="{ form, formSetting }">
        <DualList
          v-model="form.devices"
          :options="(formSetting.options as BaseModel[])"
        >
          <template #label="{ item }">
            <span>{{ item.tag }}</span>
          </template>
        </DualList>
      </template>

      <template #users="{ form, formSetting }">
        <div
          v-for="(userInspection, index) in form.user_inspections"
          :key="userInspection.id"
          class="flex mt-4"
        >
          <div class="flex flex-col flex-1 gap-4 border rounded-md p-4">
            <div class="default-field">
              <label
                class="default-label"
                :for="`user-${index}`"
              >
                User<sup>*</sup>
              </label>
              <Dropdown
                :id="`user-${index}`"
                v-model="form.user_inspections[index].user_id"
                class="default-input"
                :options="(formSetting.options as Option[])"
              />
            </div>
            <div class="default-field">
              <label
                class="default-label"
                :for="`role-${index}`"
              >
                Role
              </label>
              <input
                :id="`role-${index}`"
                v-model="form.user_inspections[index].role"
                class="default-input"
                type="text"
              >
            </div>
            <div class="grid grid-cols-2">
              <div class="default-field inline">
                <label
                  class="default-label"
                  :for="`notify-to-inspect-${index}`"
                >
                  Notify to Inspect
                </label>
                <input
                  :id="`notify-to-inspect-${index}`"
                  v-model="form.user_inspections[index].notify_to_inspect"
                  class="default-input"
                  type="checkbox"
                >
              </div>
              <div class="default-field inline">
                <label
                  class="default-label"
                  :for="`notify-to-approve-${index}`"
                >
                  Notify to Approve
                </label>
                <input
                  :id="`notify-to-approve-${index}`"
                  v-model="form.user_inspections[index].notify_to_approve"
                  class="default-input"
                  type="checkbox"
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4 ml-4">
            <button
              class="default-button flex-1"
              type="button"
              @click="handleRemoveUser(form, index)"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              class="danger-button flex-1"
              type="button"
              @click="handleRemoveUser(form, index)"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          class="info-button mt-4"
          type="button"
          @click="handleAddUser(form)"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Add User
        </button>
      </template>
    </DefaultCreateEdit>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/vue/solid'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import Loading from '@/components/helper/Loading.vue'
import DefaultPage from '@/components/default/Page.vue'
import DefaultCreateEdit from '@/components/default/CreateEdit.vue'
import DualList from '@/components/form/dualList/index.vue'
import { useNotify } from '@/composables/use-notify'
import {
  detail as getInspection,
  insert as insertInspection,
  update as updateInspection
} from '@/api/inspection'
import { get as getUser } from '@/api/user'
import { get as getDevice } from '@/api/device'
import { InspectionForm } from '@/typings/models/inspection.type'
import { FormSetting } from '@/typings/form.type'
import { Option } from '@/typings/option.type'
import { User } from '@/typings/models/user.type'
import { Device } from '@/typings/models/device.type'
import { BaseModel } from '@/typings/models/model.type'
import { UserInspection } from '@/typings/models/userInspection.type'
import { inspectionList } from '@/router/routes/inspection'

const route = useRoute()
const router = useRouter()
const deviceOptions: Ref<Device[]> = ref([])
const users: Ref<User[]> = ref([])
const userOptions: Ref<Option[]> = computed(() =>
  users.value.map((user) => ({ label: user.email, value: user.id }))
)
const frequencyOptions: Ref<Option[]> = ref([
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Weekdays', value: 'weekday' },
  { label: 'Weekend', value: 'weekend' },
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' }
])
const typeOptions: Ref<Option[]> = ref([
  { label: 'Inspection', value: 'inspection' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Testing', value: 'testing' },
  { label: 'Repair', value: 'repair' }
])

const { notify } = useNotify('inspection')

const initialData: Ref<InspectionForm> = ref()
const loading: Ref<boolean> = ref(false)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initPage = () => {
  if (!id) {
    initialData.value = new InspectionForm()
    initialData.value.interval = 1
    initialData.value.is_scheduled = false
    initialData.value.date = (new Date()).toISOString()

    handleAddUser(initialData.value)

    return
  }
  loading.value = true

  getInspection(id)
    .then((res) => {
      // TODO :: extract function
      initialData.value = new InspectionForm()
      initialData.value.id = res.data.id
      initialData.value.code = res.data.code
      initialData.value.date = res.data.date
      initialData.value.frequency = res.data.frequency
      initialData.value.interval = res.data.interval
      initialData.value.is_scheduled = res.data.is_scheduled
      initialData.value.type = res.data.type
      initialData.value.user_inspections = res.data.user_inspections
      initialData.value.devices = res.data.device_inspections.map(item => item.device)

      handleAddUser(initialData.value)
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

const onSubmit = (form, onFinish) => {
  form.value.is_scheduled = !!form.value.frequency

  if (id) {
    return updateInspection(id, { ...form.value })
      .then(() => {
        router.push(inspectionList)
        notify('updated')
      })
      .catch(() => {
        notify('updated', 'danger')
      })
      .finally(onFinish)
  } else {
    return insertInspection({ ...form.value })
      .then(() => {
        router.push(inspectionList)
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
  Promise.all([
    getUser().then((res) => {
      users.value = res.data.users
    }),
    getDevice().then((res) => {
      deviceOptions.value = res.data.devices
    })
  ])
    .then(() => {
      initForm()
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
})

const handleAddUser = (form) => {
  if (!form.user_inspections) {
    form.user_inspections = []
  }
  const userInspection = new UserInspection()
  userInspection.inspection_id = id
  form.user_inspections.push(userInspection)
}

const handleRemoveUser = (form, index) => {
  form.user_inspections.splice(index, 1)
}

const formSettings: Ref<FormSetting[]> = ref([])
const initForm = () => {
  formSettings.value = [
    {
      key: 'code',
      label: 'Code',
      isRequired: true
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date'
    },
    {
      key: 'type',
      label: 'Type',
      isRequired: true,
      type: 'dropdown',
      options: typeOptions.value
    },
    {
      key: 'frequency',
      label: 'Repeat ?',
      type: 'dropdown',
      options: frequencyOptions.value
    },
    {
      key: 'devices',
      label: 'Device Inspection',
      options: deviceOptions.value
    },
    {
      key: 'users',
      label: 'Users',
      options: userOptions.value
    }
  ]
}
initForm()
</script>
