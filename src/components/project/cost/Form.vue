<template>
  <form
    class="relative"
    @submit.prevent="submitTask"
  >
    <div class="absolute top-[0.7rem] left-3">
      <Loading
        v-if="loading"
        class="w-4 h-4"
      />
    </div>

    <input
      v-model="costPayload.name"
      class="w-full px-3 py-2 rounded-md border border-grey-soft focus:ring-info-dark focus:border-info-dark text-sm"
      placeholder="Write something"
      type="text"
    >

    <div class="absolute top-0 right-0 flex gap-1 m-[0.35rem]">
      <Datepicker
        v-model="costPayload.date"
        auto-apply
        :clearable="false"
        :enable-time-picker="false"
      >
        <template #trigger>
          <div>
            <InfoButton
              v-if="costPayload.date"
              :info="formatDate(costPayload.date)"
            >
              <div
                class="h-6 font-semibold text-xs leading-6"
                :class="{ 'mr-1': !hasDetail }"
              >
                {{ formatDate(costPayload.date) }}
              </div>
            </InfoButton>
            <InfoButton
              v-else
              info="Set Date"
            >
              <button
                class="rounded-full border border-dashed border-gray-500 p-1"
                type="button"
              >
                <CalendarIcon class="w-4 h-4 text-gray-500" />
              </button>
            </InfoButton>
          </div>
        </template>
      </Datepicker>

      <template v-if="hasDetail">
        <InfoButton info="Edit Cost">
          <button
            class="rounded-full border border-dashed border-black p-1"
            type="button"
            @click="detailCost"
          >
            <PencilAltIcon
              aria-hidden="true"
              class="h-4 w-4"
            />
          </button>
        </InfoButton>

        <InfoButton info="Delete Cost">
          <button
            class="rounded-full border border-dashed border-danger p-1 text-danger"
            type="button"
            @click="deleteCost"
          >
            <TrashIcon
              aria-hidden="true"
              class="h-4 w-4 text-danger"
            />
          </button>
        </InfoButton>
      </template>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import { CalendarIcon, TrashIcon, PencilAltIcon } from '@heroicons/vue/solid'

import { Project } from '@/typings/models/project.type'
import { ProjectCost } from '@/typings/models/project-cost.type'
import { insert as insertProjectCost, update as updateProjectCost, del as deleteProjectCost } from '@/api/project-cost'
import InfoButton from '@/components/helper/InfoButton.vue'
import Datepicker from '@vuepic/vue-datepicker'

const defaultCostPayload = {
  name: null,
  description: null,
  date: null,
  price: null,
  projectId: null
} as ProjectCost

interface Props {
  project: Project
  cost?: ProjectCost
}

const props = withDefaults(defineProps<Props>(), {
  cost: () => ({
    name: null,
    description: null,
    date: null,
    price: null,
    projectId: null
  } as ProjectCost)
})

const emit = defineEmits(['insert', 'update', 'delete', 'detail'])

const loading = ref(false)
const costPayload = ref(props.cost)

const submitTask = () => {
  loading.value = true

  const payload = {
    ...costPayload.value,
    projectId: props.project.id
  }

  if (costPayload.value.id) {
    const newPrice = payload.price as string

    payload.price = +newPrice?.toLowerCase()
      .split('rp')
      .join('')
      .split(',00')
      .join('')
      .split('.')
      .join('')
      .trim() as number

    updateProjectCost(costPayload.value.id, payload)
      .then(() => {
        emit('update', { ...costPayload })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    insertProjectCost(payload)
      .then(() => {
        emit('insert', { ...costPayload })
      })
      .finally(() => {
        costPayload.value = { ...defaultCostPayload }
        loading.value = false
      })
  }
}

watchDebounced(
  costPayload,
  () => {
    // Only auto submit if update\
    if (costPayload.value.id) {
      submitTask()
    }
  },
  {
    deep: true,
    debounce: 1000,
    maxWait: 1000
  }
)

const detailCost = () => {
  emit('detail', props.cost)
}

const hasDetail = computed(() => props?.cost?.id)

const deleteCost = () => {
  loading.value = true

  deleteProjectCost(props.cost.id)
    .then(() => {
      emit('delete', costPayload)
    })
    .finally(() => {
      loading.value = false
    })
}

const formatDate = (date) => {
  return dayjs(date).format('MMM DD')
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
