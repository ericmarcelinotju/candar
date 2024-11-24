<template>
  <div class="wrapper bg-white rounded shadow w-full">
    <div class="header flex justify-between items-center border-b p-4">
      <div v-if="$slots.default">
        <slot />
      </div>
      <div>
        <button
          class="default-button mr-4 !px-2"
          @click="handlePrevMonth"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        <span class="text-lg font-bold">
          {{ dayjsDate.format('MMMM') }} {{ dayjsDate.get('year') }}
        </span>
        <button
          class="default-button ml-4 !px-2"
          @click="handleNextMonth"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.sunday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.sun') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.monday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.mon') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.tuesday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.tue') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.wednesday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.wed') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.thursday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.thu') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.friday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.fri') }}
            </span>
          </th>
          <th
            class="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
          >
            <span class="xl:block lg:block md:block sm:block hidden">
              {{ $t('global.saturday') }}
            </span>
            <span class="xl:hidden lg:hidden md:hidden sm:hidden block">
              {{ $t('global.sat') }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(week, i) in calendar"
          :key="i"
          class="text-center h-20"
        >
          <td
            v-for="(day, j) in week"
            :key="j"
            class="border p-4 h-10 sm:h-20 md:h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease"
            :class="
              isThisMonth(day)
                ? 'hover:bg-grey-soft'
                : 'bg-grey-soft hover:bg-slate-50'
            "
            @click="handleDayClick(day)"
          >
            <div class="flex flex-col h-full w-full overflow-hidden">
              <div class="top w-full">
                <div
                  class="flex items-center justify-center w-7 h-7 text-sm float-right xl:float-left rounded-full bg-clip-padding"
                  :class="[
                    day.isToday() ? '!text-white bg-primary' : 'text-grey-dark',
                    selectedDate.isSame(day, 'day') &&
                      'border border-2 border-primary-light'
                  ]"
                >
                  {{ day.format('DD') }}
                </div>
              </div>
              <div class="bottom flex-grow h-30 w-full cursor-pointer">
                <template
                  v-for="(event, index) in events[day.format('DDMMYYYY')]"
                  :key="index"
                >
                  <div
                    class="event text-white rounded p-1 text-sm mt-2 bg-purple-400 hover:bg-purple-300 hidden xl:block"
                    @click="handleEventClick(day, event)"
                  >
                    <span class="event-name">
                      {{ event.name }} ({{ event.project?.code }})
                    </span>
                  </div>
                  <div
                    class="event w-3 h-3 text-white rounded-full text-sm mt-2 bg-purple-400 hover:bg-purple-300 block xl:hidden"
                    @click="handleEventClick(day, event)"
                  />
                </template>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { ProjectTask } from '@/typings/models/project-task.type'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

dayjs.extend(isToday)

interface Props {
  date?: Date
  events: { [key: string]: ProjectTask[] }
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date()
})

const activeDate = ref(props.date)

const emit = defineEmits(['click:date', 'click:event'])

const dayjsDate: Ref<dayjs.Dayjs> = computed(() => dayjs(activeDate.value))

const selectedDate: Ref<dayjs.Dayjs> = ref(dayjs(activeDate.value))

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const calendar: Ref<dayjs.Dayjs[][]> = computed(() => {
  const startOfMonth = dayjsDate.value.startOf('month')
  const startOfWeek = startOfMonth.startOf('week')

  const result: dayjs.Dayjs[][] = []
  for (let i = 0; i < 6; i++) {
    result[i] = []
    for (let j = 0; j < days.length; j++) {
      result[i][j] = startOfWeek.add(i * days.length + j, 'days')
    }
  }

  return result
})

const isThisMonth = (date: dayjs.Dayjs): boolean => {
  return date.month() === dayjsDate.value.month()
}

const handlePrevMonth = () => {
  activeDate.value = dayjsDate.value.add(-1, 'month').toDate()
}

const handleNextMonth = () => {
  activeDate.value = dayjsDate.value.add(1, 'month').toDate()
}

const handleDayClick = (date: dayjs.Dayjs) => {
  selectedDate.value = date
  emit('click:date', date)
}

const handleEventClick = (date: dayjs.Dayjs, event: ProjectTask) => {
  emit('click:event', date, event)
}
</script>
