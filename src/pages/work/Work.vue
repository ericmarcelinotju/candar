<template>
  <DefaultPage :title="inspection?.type + ' ' + inspection?.code">
    <div
      v-if="loading"
      class="w-full h-full flex justify-center items-center"
    >
      <Loading class="h-12 w-12" />
    </div>
    <div v-else>
      <div class="flex flex-col items-center">
        <div class="mt-2">
          <span class="text-xl font-bold">{{ activeDeviceInspection.device.address }}</span>
          <span class="text-lg">&nbsp;at&nbsp;</span>
          <span class="text-xl font-bold">{{ activeDeviceInspection.device.location.title }}</span>
        </div>
        <AnimatedCheckbox
          v-model="activeDeviceInspectionManualStatus"
          class="mt-12 w-40 h-40"
        />
        <div class="default-field w-full">
          <label
            class="mt-12 default-label"
            :for="`note-${activeDeviceInspection.id}`"
          >
            Note
          </label>
          <textarea
            :id="`note-${activeDeviceInspection.id}`"
            v-model="activeDeviceInspection.note"
            class="default-input"
          />
        </div>
        <div class="flex w-full gap-6 !mb-0 mt-6">
          <button
            v-if="!isFirstDeviceInspection"
            class="w-full default-button capitalize"
            @click="handlePrev"
          >
            <ChevronLeftIcon class="w-6 h-6" />
            Back
          </button>
          <button
            v-if="isLastDeviceInspection"
            class="w-full success-button capitalize"
            @click="handleFinish"
          >
            Finish
            <FlagIcon class="ml-2 w-5 h-5" />
          </button>
          <button
            v-else
            class="w-full info-button capitalize"
            @click="handleNext"
          >
            Next
            <ChevronRightIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeftIcon, ChevronRightIcon, FlagIcon } from '@heroicons/vue/solid'
import Loading from '@/components/helper/Loading.vue'
import DefaultPage from '@/components/default/Page.vue'
import AnimatedCheckbox from '@/components/form/AnimatedCheckbox.vue'
import { detail as getInspection, doInspection } from '@/api/inspection'
import { useNotify } from '@/composables/use-notify'
import { DeviceInspection } from '@/typings/models/deviceInspection.type'
import { Inspection } from '@/typings/models/inspection.type'
import { inspectionDetail } from '@/router/routes/inspection'

const route = useRoute()
const router = useRouter()
const { notify } = useNotify('inspection')

const inspection: Ref<Inspection> = ref()
const deviceInspections: Ref<DeviceInspection[]> = ref([])
const loading: Ref<boolean> = ref(true)
const formLoading: Ref<boolean> = ref(false)

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
      deviceInspections.value = res.data.device_inspections
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

const activeDeviceInspectionIndex = ref(0)
const activeDeviceInspection: Ref<DeviceInspection> = computed(() => deviceInspections.value[activeDeviceInspectionIndex.value])
const activeDeviceInspectionManualStatus: Ref<boolean> = computed({
  get () {
    return deviceInspections.value[activeDeviceInspectionIndex.value].manual_status === 'confirm'
  },
  set (val) {
    deviceInspections.value[activeDeviceInspectionIndex.value].manual_status = val ? 'confirm' : 'malfunction'
  }
})

const isFirstDeviceInspection = computed(() => activeDeviceInspectionIndex.value === 0)
const isLastDeviceInspection = computed(() => activeDeviceInspectionIndex.value === deviceInspections.value.length - 1)

const handleNext = () => {
  activeDeviceInspectionIndex.value = activeDeviceInspectionIndex.value + 1
}

const handlePrev = () => {
  activeDeviceInspectionIndex.value = activeDeviceInspectionIndex.value - 1
}

const handleFinish = () => {
  formLoading.value = true
  // Submit to API
  doInspection(id, deviceInspections.value)
    .then(() => {
      router.push({ ...inspectionDetail, params: { id } })
      notify('submit')
    })
    .catch(() => {
      notify('submit', 'danger')
    })
    .finally(() => {
      formLoading.value = false
    })
}
</script>
