<template>
  <div>
    <transition-group name="list">
      <TaskForm
        v-for="task in data.tasks"
        :key="task.id"
        :project="project"
        :task="task"
        @delete="onTaskUpdate"
        @detail="onTaskDetail"
        @insert="onTaskUpdate"
        @update="onTaskUpdate"
      />
    </transition-group>
    <TaskForm
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

import TaskForm from '@/components/project/task/Form.vue'
import { useNotify } from '@/composables/use-notify'

interface Props {
  data: Project
}
const props = defineProps<Props>()
const emit = defineEmits(['update', 'detail:task', 'detail:cost', 'close'])
const { notify } = useNotify('project')

const isLoaded = ref(false)
const loading = ref(true)
const project: Ref<Project> = ref(props.data)

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

        // if (isClosed.value) emit('close')
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
</script>
