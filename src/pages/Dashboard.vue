<template>
  <div class="col-span-9 p-6">
    <div class="grid grid-cols-12 gap-6">
      <div class="stat-card">
        <div class="stat-label">
          100
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
          100
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
          100 / 10
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            Projects Won / Projects Lost
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-6">
      <div class="p-6 col-span-8 rounded-md overflow-hidden bg-white shadow">
        <h1 class="text-xl font-bold mb-6">
          Project Status by Industry
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
        :has-delete="hasPermission('DELETE')"
        :has-edit="hasPermission('PUT')"
        :items="projectItems"
        :loading="false"
        :total="projectItems.length"
      >
        <template #status="{ item }">
          <span :class="getTagClass(item.status)">{{ snakeToTitle(item.status) }}</span>
        </template>
      </DefaultTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BarChart from '@/components/chart/barChart'
import PieChart from '@/components/chart/pieChart'
import DefaultTable from '@/components/default/Table.vue'
import { snakeToTitle } from '@/utils/string'

const store = useStore()
const router = useRouter()

const barData = ref([[12, 5, 1, 3], [2, 3, 5, 6], [5, 9, 5, 6], [2, 1, 1, 1]])
const barDataLabels = ref(['Cold Call', 'Qualification', 'Lead', 'Quotation'])
const barLabels = ref(['Technology', 'Real Estate', 'Government/Military', 'Education'])

const pieData = ref([12, 5, 1, 3])
const pieLabels = ref(['Cold Call', 'Qualification', 'Lead', 'Quotation'])

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
    key: 'user'
  },
  {
    label: 'Client',
    key: 'client'
  }
]

const projectItems = [
  {
    number: 'PRJ001',
    name: 'Project 01',
    status: 'cold_call',
    user: 'Nicholas',
    client: 'Nike'
  },
  {
    number: 'PRJ002',
    name: 'Project 02',
    status: 'cold_call',
    user: 'Nicholas',
    client: 'Adidas'
  },
  {
    number: 'PRJ003',
    name: 'Project 03',
    status: 'quotation',
    user: 'Nicholas',
    client: 'Puma'
  }
]

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
</script>

<style lang="scss" scoped>
.stat-card {
  @apply md:col-span-4 col-span-12 rounded-md overflow-hidden bg-white shadow;
  .stat-label {
    @apply left-3 bottom-3 w-full py-2 px-3 shadow-xl bg-primary text-lg text-white font-bold;
  }
}

</style>
