<template>
  <div class="col-span-9 p-6">
    <CalendarMonth
      :events="mappedEvents"
      @click:event="handleEventClick"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ProjectTask } from '@/typings/models/project-task.type'
import CalendarMonth from '@/components/calendar/Month.vue'
import { get as getProjectTasks } from '@/api/project-task'
import { projectList } from '@/router/routes/project'
import { useStore } from 'vuex'

// TODO :: supervisor calendar

const router = useRouter()
const store = useStore()

const projectTasks: Ref<ProjectTask[]> = ref()
const mappedEvents: Ref<{[key: string]: ProjectTask[]}> = computed(() =>
  projectTasks.value
    ? projectTasks.value.reduce(
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
  const currUser = store.getters['auth/user']

  // TODO :: Fix typing
  getProjectTasks({ userId: currUser.id } as never)
    .then(res => {
      projectTasks.value = res.data.data
    })
}

onMounted(() => {
  initPage()
})

const handleEventClick = (date: dayjs.Dayjs, event: ProjectTask) => {
  router.push({ ...projectList, params: { project_task_id: event.id } })
}

</script>
