<template>
  <div>
    <Loading
      v-if="loading"
      class="h-12 w-12 mx-auto"
    />
    <div v-else>
      <div class="-mx-6 -mt-8 px-6 py-4 bg-grey-soft font-semibold rounded-t-md">
        {{ project.client.name }} > {{ project.code }}
      </div>
      <div class="mt-3 flex gap-3">
        <div class="flex-[2_2_0%]">
          <div>
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
            <input
              v-model="project.name"
              class="hover-input font-bold text-xl"
              type="text"
            >
          </div>
          <div class="mt-3">
            <textarea
              v-model="project.description"
              class="hover-input text-sm"
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
          <p class="text-md">
            History
          </p>
          <div
            v-if="project.updates"
            class="mt-3 text-sm"
          >
            <p
              v-for="update in project.updates"
              :key="update.id"
            >
              <b>{{ update.user.username }}</b> changed status to <b>{{ update.status }}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { Project } from '@/typings/models/project.type'
import { detail as getProject } from '@/api/project'
import { useProject } from '@/composables/use-project'
import TaskForm from '@/components/project/task/Form.vue'

interface Props {
  data: Project
}

const props = defineProps<Props>()

const loading = ref(false)
const project: Ref<Project> = ref()

watch(
  () => props.data,
  (val) => {
    if (val) {
      loading.value = true
      getProject(val.id)
        .then((res) => {
          project.value = res.data
        })
        .finally(() => {
          loading.value = false
        })
    }
  },
  { immediate: true }
)

const onTaskUpdate = () => {
  getProject(props.data.id)
    .then((res) => {
      project.value = res.data
    })
}

const {
  avatar,
  userInitial,
  isAlmostExpired,
  isNeedQuotation,
  hasTag
} = useProject(props.data)
</script>
