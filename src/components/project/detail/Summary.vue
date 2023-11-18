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
      <div class="-ml-3 flex items-center ">
        <div class="mx-3">
          {{ $t('currency.rp') }}
        </div>
        <input
          v-model="project.estimate"
          class="hover-input text-sm"
          :placeholder="$t('project.tip.estimate')"
          type="number"
        >
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
      <div class="flex gap-3 text-xs font-semibold">
        <div class="p-2">
          <p class="mb-1 text-grey-dark uppercase">
            {{ $t('app.columns.created_at') }}
          </p>
          <p>{{ project.createdAt }}</p>
        </div>

        <div class="w-[0.05rem] bg-grey" />

        <div class="pt-2 px-2">
          <!-- TODO :: Only manager can update -->
          <p class="text-grey-dark uppercase">
            {{ $t('app.columns.expired_at') }}
          </p>
          <Datepicker
            v-model="project.expiredAt"
            auto-apply
            :clearable="false"
            :enable-time-picker="false"
          >
            <template #trigger>
              <div class="hover:bg-gray-200 p-1 transition duration-300 rounded-md -translate-x-1">
                <InfoButton
                  v-if="project.expiredAt"
                  :info="$t('tip.change_expired_at')"
                >
                  <p class="text-xs font-medium">
                    {{ formatDate(project.expiredAt) }}
                  </p>
                </InfoButton>
                <InfoButton
                  v-else
                  :info="$t('tip.set_expired_at')"
                >
                  -
                </InfoButton>
              </div>
            </template>
          </Datepicker>
        </div>

        <div class="w-[0.05rem] bg-grey" />

        <div class="p-2">
          <p class="mb-1 text-grey-dark uppercase">
            {{ $t('app.columns.source') }}
          </p>
          <p>{{ snakeToTitle(project.source) }}</p>
        </div>

        <div class="w-[0.05rem] bg-grey" />

        <div class="p-2">
          <p class="mb-1 text-grey-dark uppercase">
            {{ $t('app.columns.status') }}
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
import { Ref, ref, reactive, watch, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { PlusIcon, DotsVerticalIcon } from '@heroicons/vue/solid'
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
  Popover, PopoverButton, PopoverPanel,
  Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/vue'

import { Project, ProjectClose, getProjectStatusColor } from '@/typings/models/project.type'
import { update as updateProject, detail as getProject, updateStatus as updateProjectStatus } from '@/api/project'
import { get as getUser } from '@/api/user'

import { useProject } from '@/composables/use-project'
import TaskForm from '@/components/project/task/Form.vue'
import CostForm from '@/components/project/cost/Form.vue'
import { useNotify } from '@/composables/use-notify'
import { snakeToTitle } from '@/utils/string'
import { User } from '@/typings/models/user.type'
import { quotationCreate, quotationList } from '@/router/routes/quotation'
import Input from '@/components/form/Input.vue'
import Switch from '@/components/form/Switch.vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import Datepicker from '@vuepic/vue-datepicker'
import InfoButton from '@/components/helper/InfoButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'

interface Props {
  data: Project
}
const props = defineProps<Props>()
const emit = defineEmits(['update', 'detail:task', 'detail:cost', 'close'])
const router = useRouter()
const { notify } = useNotify('project')

const isLoaded = ref(false)
const loading = ref(true)
const project: Ref<Project> = ref(props.data)

const userOptions: Ref<User[]> = ref([])

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

const onCostUpdate = () => {
  // TODO :: Update without API
  getProject(props.data.id)
    .then((res) => {
      project.value = res.data
    })
}

const onTaskDetail = (data) => {
  emit('detail:task', data)
}

const onCostDetail = (data) => {
  emit('detail:cost', data)
}

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}

// Delete client
const visibleCloseConfirmationModal = ref(false)

const handleCloseProject = () => {
  visibleCloseConfirmationModal.value = true
}

// Close Project
const loadingClose: Ref<boolean> = ref(false)
const isClosed = computed(() => ['lose', 'win'].find(e => e === project.value?.status?.toLowerCase()))

const projectClose: {
  status: boolean,
  reason: string
} = reactive({
  status: true,
  reason: null
})

const confirmClose = () => {
  const { id } = project.value
  loadingClose.value = true

  const payload: ProjectClose = {
    status: projectClose.status ? 'win' : 'lose',
    reason: projectClose.reason
  }

  return updateProjectStatus(id, payload)
    .then(() => {
      project.value.status = payload.status
      emit('update', project.value)
      emit('close')

      notify('closed')
    })
    .catch(() => {
      notify('closed', 'danger')
    })
    .finally(() => {
      loadingClose.value = false
      visibleCloseConfirmationModal.value = false
    })
}

const handleClickUser = (open) => {
  return getUser()
    .then(res => {
      const { data } = res
      userOptions.value = [...data.data] as User[]
      open && open()
    })
    .catch(() => {
      notify('loaded', 'danger')
    })
}

const handleQuotation = () => {
  router.push({ ...quotationCreate, params: { project_id: project.value.id } })
}

const handleQuoted = () => {
  router.push({ ...quotationList, query: { project_id: project.value.id } })
}

const {
  isAlmostExpired,
  isNeedQuotation,
  isQuoted,
  isExpired,
  isEditable
} = useProject(props.data)
</script>
