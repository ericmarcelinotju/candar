<template>
  <div class="col-span-9 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <Dropdown
          v-if="isManager"
          v-model="filter.userId"
          class="w-52"
          :options="userOptions"
          placeholder="All user"
        />
      </div>
      <div class="font-bold text-lg">
        {{ time }}
      </div>
    </div>
    <div class="flex flex-wrap gap-6">
      <div class="stat-card">
        <div class="stat-label">
          {{ activeProjects || 0 }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.active_project') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          {{ almostDueProjects || 0 }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.almost_due_project') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          {{ winProject || 0 }} / {{ lostProject || 0 }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.win_project') }} / {{ $t('project.lose_project') }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-wrap gap-6">
      <div class="stat-card">
        <div class="stat-label">
          0
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.due_bill') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          0
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.overdue_bill') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          0
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.total_overdue_gp') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          0
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('project.disbursed_commission') }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-wrap gap-6">
      <div class="stat-card">
        <div class="stat-label">
          {{ acceptedQuotations }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('quotation.accepted') }} {{ $t('module.quotation') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          {{ approvedQuotations }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('quotation.approved') }} {{ $t('module.quotation') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          {{ draftQuotations }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('quotation.draft') }} {{ $t('module.quotation') }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          {{ sentQuotations }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t('quotation.sent') }} {{ $t('module.quotation') }}
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-6">
      <div class="p-6 col-span-8 overflow-hidden border border-neutral-50 rounded-lg">
        <h1 class="text-xl font-bold mb-6">
          {{ $t('project.status_by_source') }}
        </h1>
        <BarChart
          :colors="statusBySourceBarChart.colors"
          :data="statusBySourceBarChart.data"
          :data-labels="statusBySourceBarChart.dataLabels"
          :labels="statusBySourceBarChart.labels"
        />
      </div>
      <div class="p-6 col-span-4 overflow-hidden border border-neutral-50 rounded-lg">
        <h1 class="text-xl font-bold mb-6">
          {{ $t('project.status') }}
        </h1>
        <PieChart
          :colors="statusPieChart.colors"
          :data="statusPieChart.data"
          :labels="statusPieChart.labels"
        />
      </div>
    </div>

    <div class="mt-6 p-6 border border-neutral-50 rounded-lg">
      <h1 class="text-xl font-bold mb-2">
        {{ $t('project.me') }}
      </h1>
      <DefaultTable
        :columns="projectColumns"
        :has-delete="false"
        :has-edit="hasPermission('PUT')"
        :items="projectItems"
        :loading="false"
        :total="projectItems.length"
        @edit="handleEdit"
      >
        <template #status="{ item }">
          <span :class="getTagClass(item.status)">{{ snakeToTitle(item.status) }}</span>
        </template>
        <template #user="{ item }">
          <UserAvatar :user="item.user" />
        </template>
        <template #client="{ item }">
          {{ item.client?.name }}
        </template>
      </DefaultTable>
    </div>

    <div class="mt-6 !p-0 col-span-9 p-6 overflow-hidden border border-neutral-50 rounded-lg">
      <Calendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BarChart from '@/components/chart/barChart'
import PieChart from '@/components/chart/pieChart'
import DefaultTable from '@/components/default/Table.vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import { useNotify } from '@/composables/use-notify'
import { dealList } from '@/router/routes/deal'
import { get as getDashboard } from '@/api/dashboard'
import { get as getUser } from '@/api/user'
import { snakeToTitle } from '@/utils/string'
import { Project, getProjectStatusColor } from '@/typings/models/project.type'
import { ProjectByStatus, ProjectBySource, ProjectStatusBySource } from '@/typings/models/dashboard.type'
import { User } from '@/typings/models/user.type'
import { Option } from '@/typings/option.type'
import UserAvatar from '@/components/UserAvatar.vue'
import Calendar from '@/components/calendar/Calendar.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { notify } = useNotify('dashboard')

const statusBySourceBarChart = ref({
  data: [],
  dataLabels: [],
  labels: [],
  colors: []
})

const statusPieChart = ref({
  data: [],
  labels: [],
  colors: []
})

const projectColumns = [
  {
    label: t('app.columns.id'),
    key: 'id',
    isHidden: true
  },
  {
    label: t('app.columns.code'),
    key: 'code'
  },
  {
    label: t('app.columns.name'),
    key: 'name'
  },
  {
    label: t('app.columns.status'),
    key: 'status'
  },
  {
    label: t('app.columns.user'),
    key: 'user'
  },
  {
    label: t('app.columns.client'),
    key: 'client'
  }
]

const projectItems: Ref<Project[]> = ref([])

const activeProjects: Ref<number> = ref()
const almostDueProjects: Ref<number> = ref()
const winProject: Ref<number> = ref()
const lostProject: Ref<number> = ref()

const acceptedQuotations: Ref<number> = ref()
const approvedQuotations: Ref<number> = ref()
const draftQuotations: Ref<number> = ref()
const sentQuotations: Ref<number> = ref()

const getTagClass = (status: string) => {
  if (status === 'initiate') {
    return 'danger-tag'
  } else if (status === 'qualification') {
    return 'warning-tag'
  } else if (status === 'lead') {
    return 'info-tag'
  } else if (status === 'quotation') {
    return 'success-tag'
  }
  return 'default-tag'
}

const hasPermission = (module) => {
  return store.getters['auth/hasPermission'](module, 'GET')
}

const handleEdit = (e: Project) => {
  router.push({ name: dealList.name, params: { project_id: e.id } })
}

const users: Ref<User[]> = ref([])
const userOptions: Ref<Option[]> = computed(() => {
  const options = users.value.map((user) => ({
    label: user.username,
    value: user.id
  }))
  return [{ label: 'All', value: null }, ...options]
})

const filter = ref({
  userId: null
})

watch(
  filter,
  () => {
    processDashboard()
  },
  { deep: true }
)

const initPage = () => {
  if (isManager.value && currUser.value.divisionId) {
    getUser({ divisionId: currUser.value.divisionId } as never).then((res) => {
      users.value = res.data.data
    })
  }
  processDashboard()
}

onMounted(() => {
  initPage()
  initTime()
})

const processDashboard = () => {
  const payload = filter.value.userId ? { userId: filter.value.userId } : undefined
  getDashboard(payload)
    .then((result) => {
      projectItems.value = result.data.projects

      const statusData = []
      const statusLabels = []
      const statusColors = []
      result.data.projectByStatus.forEach(item => {
        statusData.push(item.count)
        statusLabels.push(item.status)
        statusColors.push(getProjectStatusColor(item.status))
      })
      statusPieChart.value = {
        data: statusData,
        labels: statusLabels,
        colors: statusColors
      }

      // const statusBySourceData = new Map()
      // const statusSourceDataLabelSet = new Set()
      // const statusSourceLabels = []
      // result.data.projectBySource.forEach(sourceItem => {
      //   sourceItem.status.forEach(item => {
      //     statusSourceDataLabelSet.add(item.status)
      //     if (!statusBySourceData.has(item.status)) {
      //       statusBySourceData.set(item.status, new Map())
      //     }
      //     const dataByStatus = statusBySourceData.get(item.status)
      //     dataByStatus.set(sourceItem.source)
      //     statusBySourceData.set(item.status, dataByStatus)
      //   })
      //   statusSourceLabels.push(sourceItem.source)
      // })

      // const statusSourceDataLabels = Array.from(statusSourceDataLabelSet)

      // const test = []
      // statusSourceDataLabels.forEach((status) => {
      //   const asd = []
      //   statusSourceDataLabels
      // })
      // statusBySourceBarChart.value = {
      //   data: Array.from(statusBySourceData.values()),
      //   dataLabels: Array.from(statusBySourceData.keys()),
      //   labels: statusSourceLabels,
      //   colors: statusBySourceColors
      // }

      activeProjects.value = result.data.activeProject
      almostDueProjects.value = result.data.almostDueProject
      winProject.value = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'win')?.count || 0
      lostProject.value = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'lose')?.count || 0

      acceptedQuotations.value = result.data.quotationByStatus.find((e) => e.status === 'accepted')?.count || 0
      approvedQuotations.value = result.data.quotationByStatus.find((e) => e.status === 'approved')?.count || 0
      draftQuotations.value = result.data.quotationByStatus.find((e) => e.status === 'draft')?.count || 0
      sentQuotations.value = result.data.quotationByStatus.find((e) => e.status === 'sent')?.count || 0

      const sources = []
      const statusList = []
      const colorList = []

      // First filter the status and store it on statusList variable
      result.data.projectBySource.forEach((e: ProjectBySource) => {
        sources.push(e.source)
        e.status.forEach((e2: ProjectStatusBySource) => {
          if (!statusList.some((e3) => e2?.status.toLowerCase() === e3.toLowerCase())) {
            statusList.push(e2?.status[0].toUpperCase() + e2?.status.slice(1))
            colorList.push(getProjectStatusColor(e2?.status))
          }
        })
      })

      statusBySourceBarChart.value.labels = [...sources]
      statusBySourceBarChart.value.dataLabels = [...statusList]
      statusBySourceBarChart.value.colors = [...colorList]

      const rawSourceData = []
      const sourceData = []

      // Filter it by source first
      result.data.projectBySource.forEach((e: ProjectBySource, index: number) => {
        // Populate the rawSourceData and sourceData paralel
        rawSourceData.push(new Array(statusList.length).fill(0))
        e.status.forEach((e2: ProjectStatusBySource) => {
          const findIndex = statusList.findIndex((e3: string) => {
            return e3.toLowerCase() === e2?.status.toLowerCase()
          })
          rawSourceData[index][findIndex] = e2.count
        })
      })

      // Reconstruct the data so the bar chart can visualize it properly
      rawSourceData.forEach((sources: string[], i: number) => {
        sources.forEach((count: string, j: number) => {
          if (!sourceData[j]) {
            sourceData[j] = []
          }
          sourceData[j][i] = count
        })
      })

      statusBySourceBarChart.value.data = [...sourceData]
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
}

const currUser: Ref<User> = computed(() => store.getters['auth/user'])
const isManager: Ref<boolean> = computed(() => store.getters['auth/isManager'])

const interval = ref(null)
const time = ref('')

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const initTime = () => {
  // update the time every second
  interval.value = setInterval(() => {
    // Concise way to format time according to system locale.
    // In my case this returns "3:48:00 am"
    time.value = Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).format()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.stat-card {
  @apply md:flex-1 w-full rounded-md overflow-hidden border border-neutral-50 rounded-lg;
  .stat-label {
    @apply left-3 bottom-3 w-full py-2 px-3 shadow-xl bg-primary text-lg text-white font-bold;
  }
}

</style>
