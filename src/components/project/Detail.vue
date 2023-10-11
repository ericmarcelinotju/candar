<template>
  <div class="relative">
    <Loading
      v-if="loading"
      class="h-12 w-12 mx-auto"
    />
    <div v-else>
      <Loading
        v-if="saveLoading"
        class="absolute bottom-0 right-3 h-6 w-6"
      />
      <div class="-mx-6 -mt-8 px-6 py-4 bg-grey-soft font-semibold rounded-t-md">
        {{ project.client?.name }} > {{ project.code }}
      </div>
      <div class="mt-3 flex gap-3">
        <div class="flex-[2_2_0%] px-3">
          <div class="flex gap-2 mb-2">
            <div
              v-if="isAlmostExpired"
              class="danger-tag"
            >
              Antention Needed
            </div>
            <div
              v-if="isNeedQuotation"
              class="warning-tag"
            >
              Quotation Needed
            </div>
            <div class="flex justify-end">
              <div v-if="avatar">
                <img :src="avatar">
              </div>
              <div
                v-else
                class="info-tag !rounded-full capitalize"
              >
                {{ userInitial }}
              </div>
            </div>
          </div>
          <div class="-ml-3">
            <input
              v-model="project.name"
              class="hover-input font-bold text-xl"
              type="text"
            >
          </div>
          <div class="-ml-3">
            <textarea
              v-model="project.description"
              class="hover-input text-sm h-36"
              placeholder="Write something"
            />
          </div>
          <div class="mt-3">
            <p class="text-md">
              Tasks
            </p>

            <div class="mt-3 flex flex-col gap-3">
              <transition-group name="list">
                <TaskForm
                  v-for="task in project.tasks"
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
          </div>
        </div>
        <div class="flex-1 border-l px-3">
          <div class="flex gap-3 text-xs font-semibold">
            <div class="p-2">
              <p class="mb-1 text-grey-dark">
                CREATED
              </p>
              <p>{{ formatDate(project.created_at) }}</p>
            </div>

            <div class="w-[0.05rem] bg-grey" />

            <div class="p-2">
              <p class="mb-1 text-grey-dark">
                SOURCE
              </p>
              <p>{{ snakeToTitle(project.source) }}</p>
            </div>

            <div class="w-[0.05rem] bg-grey" />

            <div class="p-2">
              <p class="mb-1 text-grey-dark">
                STATUS
              </p>
              <p
                class="info-tag !pt-0 !pb-[0.1rem]"
                :style="`background-color: ${getProjectStatusColor(project.status)};`"
              >
                {{ snakeToTitle(project.status) }}
              </p>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-md">
              History
            </p>
            <div
              v-if="project.updates"
              class="ml-1 mt-1 text-sm"
            >
              <p
                v-for="update in project.updates"
                :key="update.id"
                class="mt-1"
              >
                <b>{{ update.user.username }}</b> changed status to <b>{{ update.status }}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import { Project, getProjectStatusColor } from '@/typings/models/project.type'
import { update as updateProject, detail as getProject } from '@/api/project'
import { useProject } from '@/composables/use-project'
import TaskForm from '@/components/project/task/Form.vue'
import { useNotify } from '@/composables/use-notify'
import { snakeToTitle } from '@/utils/string'

interface Props {
  data: Project
}

const props = defineProps<Props>()

const emit = defineEmits(['update', 'detail:task'])

const { notify } = useNotify('project')

const isLoaded = ref(false)
const loading = ref(true)
const project: Ref<Project> = ref()

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

    const payload = project.value
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

const formatDate = (date) => {
  return dayjs(date).format('MMM DD, HH:mm')
}

const {
  avatar,
  userInitial,
  isAlmostExpired,
  isNeedQuotation,
  hasTag
} = useProject(props.data)
</script>
