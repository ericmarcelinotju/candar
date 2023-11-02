<template>
  <div class="col-span-9 p-6">
    <CalendarMonth
      :events="mappedEvents"
      @click:event="handleEventClick"
    >
      <Dropdown
        v-if="isManager"
        v-model="filter.userId"
        class="w-52"
        :options="userOptions"
        placeholder="All user"
      />
    </CalendarMonth>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { ProjectTask } from '@/typings/models/project-task.type'
import CalendarMonth from '@/components/calendar/Month.vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import { get as getProjectTasks } from '@/api/project-task'
import { get as getUser } from '@/api/user'
import { projectList } from '@/router/routes/project'
import { User } from '@/typings/models/user.type'
import { Option } from '@/typings/option.type'

// TODO :: supervisor calendar

const router = useRouter()
const store = useStore()

const projectTasks: Ref<ProjectTask[]> = ref()
const mappedEvents: Ref<{ [key: string]: ProjectTask[] }> = computed(() =>
  projectTasks.value
    ? projectTasks.value.reduce((obj, item) => {
      const key = dayjs(item.date).format('DDMMYYYY')
      if (!obj[key]) {
        obj[key] = [item]
      } else {
        obj[key].push(item)
      }
      return obj
    }, {})
    : {}
)

const users: Ref<User[]> = ref([])
const userOptions: Ref<Option[]> = computed(() => {
  const options = users.value.map((user) => ({
    label: user.username,
    value: user.id
  }))
  return [{ label: 'All', value: null }, ...options]
})

const currUser: Ref<User> = computed(() => store.getters['auth/user'])
const isManager: Ref<boolean> = computed(() => currUser.value.role.isManager)

const initPage = () => {
  if (isManager.value && currUser.value.divisionId) {
    getUser({ divisionId: currUser.value.divisionId } as never).then((res) => {
      users.value = res.data.data
    })

    getProjectTasks({ divisionId: currUser.value.divisionId } as never).then(
      (res) => {
        projectTasks.value = res.data.data
      }
    )
  } else {
    getProjectTasks({ userId: currUser.value.id } as never).then((res) => {
      projectTasks.value = res.data.data
    })
  }
}

onMounted(() => {
  initPage()
})

const filter = ref({
  userId: null
})

watch(
  filter,
  () => {
    if (filter.value.userId) {
      getProjectTasks({ userId: filter.value.userId } as never).then((res) => {
        projectTasks.value = res.data.data
      })
    } else {
      getProjectTasks({ divisionId: currUser.value.divisionId } as never).then(
        (res) => {
          projectTasks.value = res.data.data
        }
      )
    }
  },
  { deep: true }
)

const handleEventClick = (date: dayjs.Dayjs, event: ProjectTask) => {
  router.push({ ...projectList, params: { project_task_id: event.id } })
}
</script>
