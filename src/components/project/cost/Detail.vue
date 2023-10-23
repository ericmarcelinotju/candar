<template>
  <div class="relative">
    <Loading
      v-if="loading"
      class="h-12 w-12 mx-auto"
    />
    <div
      v-else
      class="-mt-3"
    >
      <Loading
        v-if="saveLoading"
        class="absolute bottom-0 right-3 h-6 w-6"
      />
      <div class="mt-3 flex gap-3">
        <div class="flex-[2_2_0%] px-3">
          <div class="-ml-3">
            <input
              v-model="projectCost.name"
              class="mt-3 hover-input font-bold text-xl"
              type="text"
            >
          </div>
          <div class="-ml-3">
            <p class="text-grey-dark text-xs font-semibold ml-3 mt-3 ">
              Price
            </p>
            <div class="input-group prefix">
              <span class="input-group-addon">Rp.</span>
              <input
                v-model="projectCost.price"
                class="hover-input font-bold text-sm max-w-[50%]"
                max="99999999"
                name="input"
                type="number"
              >
            </div>
          </div>
          <div class="-ml-3">
            <p class="text-grey-dark text-xs font-semibold ml-3 mt-3 ">
              Description
            </p>
            <textarea
              v-model="projectCost.description"
              class="hover-input h-36 text-sm"
              placeholder="Write something"
            />
          </div>
        </div>
        <div class="flex-1 border-l px-3">
          <div class="pt-2 px-2 text-xs font-semibold">
            <p class="text-grey-dark">
              DATE
            </p>
            <Datepicker
              v-model="projectCost.date"
              auto-apply
              :clearable="false"
              :enable-time-picker="false"
            >
              <template #trigger>
                <div class="hover:bg-gray-200 p-1 transition duration-300 rounded-md -translate-x-1">
                  <InfoButton
                    v-if="projectCost.date"
                    :info="formatDate(projectCost.date)"
                  >
                    <!-- <p>{{ projectCost.createdAt }}</p> -->
                    <p class="text-xs font-semibold">
                      {{ formatDate(projectCost.date) }}
                    </p>
                  </InfoButton>
                  <InfoButton
                    v-else
                    info="Set Date"
                  >
                    -
                  </InfoButton>
                </div>
              </template>
            </Datepicker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import InfoButton from '@/components/helper/InfoButton.vue'
import Datepicker from '@vuepic/vue-datepicker'

import { update as updateProjectCost, detail as getProjectCost } from '@/api/project-cost'
import { ProjectCost } from '@/typings/models/project-cost.type'
import { useNotify } from '@/composables/use-notify'

interface Props {
  data: ProjectCost
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

const { notify } = useNotify('task')

const isLoaded = ref(false)
const loading = ref(true)
const projectCost: Ref<ProjectCost> = ref()

watch(() => projectCost.value?.price, (val) => {
  const newString = +val > 99999999 ? 99999999 : val
  projectCost.value.price = `${newString}`
})

watch(
  () => props.data,
  (val) => {
    if (val) {
      getProjectCost(val.id)
        .then((res) => {
          const newPrice = res.data.price as string
          res.data.price = newPrice?.toLowerCase()
            .split('rp')
            .join('')
            .split(',00')
            .join('')
            .split('.')
            .join('')
            .trim()
          projectCost.value = res.data
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
  projectCost,
  () => {
    if (!isLoaded.value) { return }
    saveLoading.value = true

    const payload = {
      ...projectCost.value,
      projectId: projectCost.value?.project?.id
    }

    updateProjectCost(projectCost.value.id, payload)
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

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}

</script>
