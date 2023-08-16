<template>
  <div class="px-4 lg:px-8">
    <div class="shadow overflow-hidden rounded-md bg-white p-6">
      <BarChart
        :data="queueChartData"
        :data-labels="['Ready', 'Rejected']"
        :labels="['Backup']"
      />
      <div class="flex justify-between mt-6">
        <button
          class="info-button mr-4"
          type="button"
          @click="onTriggerMeter"
        >
          Trigger Auto Backup
        </button>

        <button
          class="danger-button mr-4"
          type="button"
          @click="onPurgeMeter"
        >
          Purge Rejected
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { queue as getQueueStat } from '@/api/stat'
// import { triggerBilling, purgeRejected as purgeBillingQueue } from '@/api/billing.js'
// import { triggerMeter, purgeRejected as purgeMeterQueue } from '@/api/meter.js'
import BarChart from '@/components/chart/barChart'

const loading = ref(false)
const queueChartData = ref([])

const getStat = () => {
  loading.value = true
  getQueueStat(null)
    .then(res => {
      const queueStat = res.data
      queueChartData.value[0] = [queueStat.backup.ready]
      queueChartData.value[1] = [queueStat.backup.rejected]
      loading.value = false
    }, () => {
      loading.value = false
    })
}

let interval

onMounted(() => {
  getStat()
  interval = setInterval(getStat, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const onTriggerMeter = () => {
  // triggerMeter(() => {
  //   getStat()
  // })
}

const onTriggerBilling = () => {
  // triggerBilling(() => {
  //   getStat()
  // })
}

const onPurgeMeter = () => {
  // purgeMeterQueue(() => {
  //   getStat()
  // })
}

const onPurgeBilling = () => {
  // purgeBillingQueue(() => {
  //   getStat()
  // })
}
</script>
