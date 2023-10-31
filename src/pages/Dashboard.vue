<template>
  <div class="col-span-9 p-6">
    <div class="grid grid-cols-12 gap-6">
      <div class="stat-card">
        <div class="stat-label">
          {{ activeProjects || 0 }}
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            Active Projects
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
            Almost Due Project
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
            Projects Win / Projects Lost
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-6">
      <div class="p-6 col-span-8 rounded-md overflow-hidden bg-white shadow">
        <h1 class="text-xl font-bold mb-6">
          Project Status by Source
        </h1>
        <BarChart
          :data="barData"
          :data-labels="barDataLabels"
          :labels="barLabels"
        />
      </div>
      <div class="p-6 col-span-4 rounded-md overflow-hidden bg-white shadow">
        <h1 class="text-xl font-bold mb-6">
          Project Status
        </h1>
        <PieChart
          :data="pieData"
          :labels="pieLabels"
        />
      </div>
    </div>

    <div class="mt-6 p-6 rounded-md overflow-hidden bg-white shadow">
      <h1 class="text-xl font-bold mb-2">
        My Projects
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
      </DefaultTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarChart from '@/components/chart/barChart'
import PieChart from '@/components/chart/pieChart'
import DefaultTable from '@/components/default/Table.vue'
import { useNotify } from '@/composables/use-notify'
import { projectList } from '@/router/routes/project'

import { get as getDashboard } from '@/api/dashboard'

import { snakeToTitle } from '@/utils/string'
import { Project } from '@/typings/models/project.type'
import { ProjectByStatus, ProjectBySource, ProjectStatusBySource } from '@/typings/models/dashboard.type'

const store = useStore()
const router = useRouter()
const { notify } = useNotify('dashboard')

const barData = ref([])
const barDataLabels = ref([])
const barLabels = ref([])

const pieData = ref([0, 0, 0, 0])
const pieLabels = ref(['Inititate', 'Qualification', 'Lead', 'Quotation'])

const projectColumns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Code',
    key: 'code',
    isSearchable: true,
    isSortable: true
  },
  {
    label: 'Name',
    key: 'name'
  },
  {
    label: 'Status',
    key: 'status'
  },
  {
    label: 'User',
    key: 'user.username'
  },
  {
    label: 'Client',
    key: 'client.name'
  }
]

const projectItems: Ref<Project[]> = ref([])

const activeProjects: Ref<number> = ref()
const almostDueProjects: Ref<number> = ref()
const winProject: Ref<number> = ref()
const lostProject: Ref<number> = ref()

// const projectItems = [
//   {
//     number: 'PRJ001',
//     name: 'Project 01',
//     status: 'cold_call',
//     user: 'Nicholas',
//     client: 'Nike'
//   },
//   {
//     number: 'PRJ002',
//     name: 'Project 02',
//     status: 'cold_call',
//     user: 'Nicholas',
//     client: 'Adidas'
//   },
//   {
//     number: 'PRJ003',
//     name: 'Project 03',
//     status: 'quotation',
//     user: 'Nicholas',
//     client: 'Puma'
//   }
// ]

const getTagClass = (status: string) => {
  if (status === 'cold_call') {
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
  router.push({ name: projectList.name, params: { project_id: e.id } })
}

const initPage = () => {
  getDashboard()
    .then((result) => {
      projectItems.value = result.data.projects

      activeProjects.value = result.data.activeProject
      almostDueProjects.value = result.data.almostDueProject
      winProject.value = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'win')?.count || 0
      lostProject.value = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'lose')?.count || 0

      const initiateProject = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'initiate')
      const leadProject = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'lead')
      const quotationProject = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'quotation')
      const qualificationProject = result.data.projectByStatus.find((e: ProjectByStatus) => e.status === 'qualification')

      const sources = []
      const statusList = []

      // First filter the status and store it on statusList variable
      result.data.projectBySource.forEach((e: ProjectBySource) => {
        sources.push(e.source)
        e.status.forEach((e2: ProjectStatusBySource) => {
          if (!statusList.some((e3) => e2?.status.toLowerCase() === e3.toLowerCase())) {
            statusList.push(e2?.status[0].toUpperCase() + e2?.status.slice(1))
          }
        })
      })

      barLabels.value = [...sources]
      barDataLabels.value = [...statusList]

      const rawSourceData = []
      const sourceData = []

      // Filter it by source first
      result.data.projectBySource.forEach((e: ProjectBySource, index: number) => {
        // Populate the rawSourceData and sourceData paralel
        sourceData.push(new Array(statusList.length).fill(0))
        rawSourceData.push(new Array(statusList.length).fill(0))
        e.status.forEach((e2: ProjectStatusBySource) => {
          const findIndex = statusList.findIndex((e3: string) => {
            return e3.toLowerCase() === e2?.status.toLowerCase()
          })
          rawSourceData[index][findIndex] = e2.count
        })
      })

      // Reconstruct the data so the bar chart can visualize it properly
      rawSourceData.forEach((e: string[], index: number) => {
        e.forEach((e2: string, index2: number) => {
          sourceData[index2][index] = e2
        })
      })

      barData.value = [...sourceData]

      pieData.value = [initiateProject?.count || 0, qualificationProject?.count || 0, leadProject?.count || 0, quotationProject?.count || 0]
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
}

onMounted(() => {
  initPage()
})
</script>

<style lang="scss" scoped>
.stat-card {
  @apply md:col-span-4 col-span-12 rounded-md overflow-hidden bg-white shadow;
  .stat-label {
    @apply left-3 bottom-3 w-full py-2 px-3 shadow-xl bg-primary text-lg text-white font-bold;
  }
}

</style>
