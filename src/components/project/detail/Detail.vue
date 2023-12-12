<template>
  <div>
    <Tabs
      class="mt-3"
      :options="tabOptions"
    >
      <template #activity>
        <transition-group name="list">
          <TaskForm
            v-for="task in project.tasks"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
      <template #call>
        <transition-group name="list">
          <TaskForm
            v-for="task in filterTask('call', project.tasks)"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
      <template #email>
        <transition-group name="list">
          <TaskForm
            v-for="task in filterTask('email', project.tasks)"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
      <template #meeting>
        <transition-group name="list">
          <TaskForm
            v-for="task in filterTask('meeting', project.tasks)"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
      <template #note>
        <transition-group name="list">
          <TaskForm
            v-for="task in filterTask('note', project.tasks)"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
      <template #task>
        <transition-group name="list">
          <TaskForm
            v-for="task in filterTask('task', project.tasks)"
            :key="task.id"
            class="mt-3"
            :project="project"
            :task="task"
            @delete="onTaskUpdate"
            @detail="onTaskDetail"
            @insert="onTaskUpdate"
            @update="onTaskUpdate"
          />
        </transition-group>
      </template>
    </Tabs>

    <TaskForm
      class="mt-3"
      :project="project"
      @delete="onTaskUpdate"
      @insert="onTaskUpdate"
      @update="onTaskUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'

import { Project } from '@/typings/models/project.type'
import { update as updateProject, detail as getProject } from '@/api/project'
import Tabs from '@/components/default/Tabs.vue'
import TaskForm from '@/components/project/task/Form.vue'
import { useNotify } from '@/composables/use-notify'
import { useI18n } from 'vue-i18n'
import { Option } from '@/typings/option.type'
import { ProjectTask } from '@/typings/models/project-task.type'

interface Props {
  data: Project
}
const props = defineProps<Props>()
const emit = defineEmits(['update', 'detail:task'])
const { t } = useI18n()
const { notify } = useNotify('project')

const isLoaded = ref(false)
const loading = ref(true)
const project: Ref<Project> = ref(props.data)

const tabOptions: Ref<Option[]> = ref([
  { label: t('project.task.activity'), value: 'activity' },
  { label: t('project.task.call'), value: 'call' },
  { label: t('project.task.email'), value: 'email' },
  { label: t('project.task.meeting'), value: 'meeting' },
  { label: t('project.task.note'), value: 'note' },
  { label: t('project.task.task'), value: 'task' }
])

watch(
  () => props.data,
  (val) => {
    if (val) {
      getProject(val.id)
        .then((res) => {
          project.value = res.data
          isLoaded.value = true
        })
        .finally(() => {
          loading.value = false
        })
    }
  },
  { immediate: true }
)

const saveLoading = ref(false)
watchDebounced(
  project,
  () => {
    if (!isLoaded.value) { return }

    saveLoading.value = true

    const payload = { ...project.value }

    if (payload.user?.id) {
      payload.userId = payload.user?.id
    }

    if (project.value?.expiredAt) {
      payload.expiredAt = new Date(project.value?.expiredAt)
    }

    updateProject(payload.id, payload)
      .then(() => {
        emit('update', payload)
      })
      .catch(() => {
        notify('saved', 'danger')
      })
      .finally(() => {
        saveLoading.value = false
      })
  },
  {
    deep: true,
    debounce: 1000,
    maxWait: 1000
  }
)

const onTaskUpdate = () => {
  // TODO :: Update without API
  getProject(props.data.id)
    .then((res) => {
      project.value = res.data
    })
}

const onTaskDetail = (data) => {
  emit('detail:task', data)
}

const filterTask = (type: string, tasks: ProjectTask[]): ProjectTask[] => {
  return tasks.filter(task => task.type === type)
}
</script>
