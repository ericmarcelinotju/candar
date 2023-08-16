<template>
  <div class="col-span-9 p-6">
    <div class="grid grid-cols-12 gap-6">
      <!-- <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.branch") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.extension") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.recording") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold"> Logged In Users </span>
        </div>
      </div> -->
      <div class="col-span-12">
        <Calendar
          :events="mappedInspections"
          @click:event="handleEventClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Calendar from '@/components/calendar/Month.vue'
import { get as getInspections } from '@/api/inspection'
import { Inspection } from '@/typings/models/inspection.type'
import dayjs from 'dayjs'
import { inspectionDetail } from '@/router/routes/inspection'

const router = useRouter()
const store = useStore()

const inspections: Ref<Inspection[]> = ref()
const mappedInspections: Ref<{[key: string]: Inspection[]}> = computed(() =>
  inspections.value
    ? inspections.value.reduce(
      (obj, item) => {
        const key = dayjs(item.date).format('DDMMYYYY')
        if (!obj[key]) {
          obj[key] = [item]
        } else {
          obj[key].push(item)
        }
        return obj
      },
      {}
    )
    : {}
)

const initPage = () => {
  getInspections()
    .then(res => {
      inspections.value = res.data.inspections
    })
}

const handleEventClick = (date, { id }) => {
  router.push({ ...inspectionDetail, params: { id } })
}

onMounted(() => {
  initPage()
})

const hasPermission = (module) => {
  return store.getters['auth/hasPermission'](module, 'GET')
}
</script>

<style lang="scss" scoped>
.stat-label {
  @apply left-3 bottom-3 w-full p-3 shadow-xl bg-primary text-lg text-white font-bold;
}
</style>
