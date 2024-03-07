<template>
  <div class="mt-3 flex gap-3">
    <div class="flex-[1_1_20%] px-3">
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
          :placeholder="$t('project.tip.note')"
        />
      </div>
      <div class="-ml-3 mt-1 flex items-center ">
        <div class="mx-3">
          {{ $t('currency.rp') }}
        </div>
        <CurrencyInput
          v-model="project.estimate"
          class="hover-input text-sm"
          :placeholder="$t('project.tip.estimate')"
        />
      </div>
      <!-- <div class="mt-6">
        <p class="text-md">
          Costs
        </p>

        <div class="mt-3 flex flex-col gap-3">
          <transition-group name="list">
            <CostForm
              v-for="cost in project.costs"
              :key="cost.id"
              :cost="cost"
              :project="project"
              @delete="onCostUpdate"
              @detail="onCostDetail"
              @insert="onCostUpdate"
              @update="onCostUpdate"
            />
          </transition-group>
          <CostForm
            :project="project"
            @delete="onCostUpdate"
            @insert="onCostUpdate"
            @update="onCostUpdate"
          />
        </div>
      </div> -->
    </div>
    <div class="flex-1 border-l px-3">
      <div class="mt-3">
        <p class="text-md">
          History
        </p>
        <div
          v-if="project.updates"
          class="ml-1 mt-1 text-sm overflow-scroll max-h-[70vh]"
        >
          <p
            v-for="update in project.updates"
            :key="update.id"
            class="mt-1"
          >
            <b>{{ update.user?.username || 'system' }}</b> changed the status to <b>{{ update.status }}</b>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import { Project } from '@/typings/models/project.type'
import { update as updateProject, detail as getProject } from '@/api/project'

import { useNotify } from '@/composables/use-notify'
import CurrencyInput from '@/components/form/CurrencyInput.vue'

interface Props {
  data: Project
}
const props = defineProps<Props>()
const emit = defineEmits(['update'])
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

const priorityLabel = computed(() => project.value.priority > 75 ? 'High' : project.value.priority > 49 ? 'Medium' : 'Low')
const priorityColor = computed(() => project.value.priority > 75 ? 'bg-red-500' : project.value.priority > 49 ? 'bg-yellow-500' : 'bg-blue-500')

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}
</script>
