<template>
  <DefaultPage :title="inspection?.type + ' ' + inspection?.code">
    <div
      v-if="loading"
      class="w-full h-full flex justify-center items-center"
    >
      <Loading class="h-12 w-12" />
    </div>
    <div v-else>
      <div class="default-field mt-2">
        <span class="text-xl font-bold">Scheduled at {{ formattedDate }}</span>
      </div>
      <div
        v-if="unCheckedInspections.length > 0"
        class="default-field mt-6"
      >
        <label class="text-lg font-semibold">Unchecked Devices</label>
        <DefaultTable
          :columns="unCheckedInspectionColumns"
          :has-delete="false"
          :has-edit="false"
          :has-pagination="false"
          :items="unCheckedInspections"
          :loading="loading"
          :total="0"
        >
          <template #device="{ item }">
            {{ item.device.address }}
          </template>
          <template #location="{ item }">
            {{ item.device.location.title }}
          </template>
        </DefaultTable>
      </div>
      <div
        v-if="checkedInspections.length > 0"
        class="default-field mt-4"
      >
        <label class="text-lg font-semibold">Checked Devices</label>
        <DefaultTable
          :columns="checkedInspectionColumns"
          :has-delete="false"
          :has-edit="false"
          :has-pagination="false"
          :items="checkedInspections"
          :loading="loading"
          :total="0"
        >
          <template #device="{ item }">
            {{ item.device.address }}
          </template>
          <template #location="{ item }">
            {{ item.device.location.title }}
          </template>
        </DefaultTable>
      </div>

      <div class="default-field mt-6">
        <label class="text-lg font-semibold">Involved Users</label>
        <DefaultTable
          :columns="userInspectionColumns"
          :has-delete="false"
          :has-edit="false"
          :has-pagination="false"
          :items="inspection.user_inspections"
          :loading="loading"
          :total="0"
        >
          <template #username="{ item }">
            {{ item.user.username }}
          </template>
          <template #email="{ item }">
            {{ item.user.email }}
          </template>
        </DefaultTable>
      </div>

      <div class="default-field mt-6">
        <button
          class="info-button capitalize"
          @click="handleStartWork"
        >
          Start {{ inspection.type }}
        </button>
      </div>
    </div>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Loading from '@/components/helper/Loading.vue'
import DefaultPage from '@/components/default/Page.vue'
import DefaultTable from '@/components/default/Table.vue'
import { detail as getInspection } from '@/api/inspection'
import { useNotify } from '@/composables/use-notify'
import { Inspection } from '@/typings/models/inspection.type'
import { DeviceInspection } from '@/typings/models/deviceInspection.type'
import { workRoute } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const { notify } = useNotify('inspection')

const inspection: Ref<Inspection> = ref()
const loading: Ref<boolean> = ref(true)

let id = ''
if (typeof route.params.id === 'string') {
  id = route.params.id
}

const initPage = () => {
  if (!id) return
  loading.value = true

  getInspection(id)
    .then((res) => {
      inspection.value = res.data
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  initPage()
})

const formattedDate = computed(() => inspection.value && dayjs(inspection.value.date).format('DD MMMM YYYY'))

const unCheckedInspections: Ref<DeviceInspection[]> = computed(() => inspection.value.device_inspections.filter(item => !item.manual_status))
const unCheckedInspectionColumns = [
  {
    label: 'Device',
    key: 'device'
  },
  {
    label: 'Location',
    key: 'location'
  }
]

const checkedInspections: Ref<DeviceInspection[]> = computed(() => inspection.value.device_inspections.filter(item => item.manual_status === 'confirm' || item.manual_status === 'malfunction'))
const checkedInspectionColumns = [
  {
    label: 'Device',
    key: 'device'
  },
  {
    label: 'Location',
    key: 'location'
  },
  {
    label: 'Status',
    key: 'manual_status'
  },
  {
    label: 'Note',
    key: 'note'
  }
]

const userInspectionColumns = [
  {
    label: 'Username',
    key: 'username'
  },
  {
    label: 'Email',
    key: 'email'
  },
  {
    label: 'Role',
    key: 'role'
  }
]

const handleStartWork = () => {
  router.push({ ...workRoute, params: { id } })
}
</script>
