<template>
  <div class="relative">
    <Loading
      v-if="loading"
      class="h-12 w-12 mx-auto"
    />
    <fieldset
      v-else
      :disabled="!isEditable"
    >
      <Loading
        v-if="saveLoading"
        class="absolute bottom-0 right-3 h-6 w-6"
      />
      <div class="-mx-6 -mt-8 px-6 py-4 bg-grey-soft font-semibold rounded-t-md">
        {{ project.client?.name }} > {{ project.code }}
      </div>
      <div class="mt-3 flex gap-3">
        <div class="flex-[1_1_11%] px-3">
          <div class="flex flex-row justify-between gap-2 mb-2">
            <div class="flex flex-row gap-2 items-center">
              <div
                v-if="isExpired"
                class="danger-tag"
              >
                Expired
              </div>
              <div
                v-else-if="isAlmostExpired"
                class="warning-tag"
              >
                Almost Expired
              </div>
              <div
                v-if="isNeedQuotation"
                class="info-tag cursor-pointer hover:bg-info-dark"
                @click="handleQuotation"
              >
                <PlusIcon class="w-3 h-3 mr-1" />
                Quotation Needed
              </div>
              <div
                v-if="isQuoted"
                class="success-tag cursor-pointer hover:bg-success-dark"
                @click="handleQuoted"
              >
                Quoted
              </div>
              <Popover
                v-slot="{ open }"
                class="relative"
              >
                <PopoverButton @click="() => handleClickUser(open)">
                  <div class="flex justify-end p-0.5 hover:cursor-pointer hover:opacity-70 rounded-full">
                    <UserAvatar :user="data.user" />
                  </div>
                </PopoverButton>
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
                >
                  <PopoverPanel
                    class="absolute left-0 z-10 mt-2 min-w-[200px] max-w-sm transform px-4 sm:px-0 bg-white"
                  >
                    <Dropdown
                      v-model="project.user"
                      class="default-input"
                      item-key="username"
                      :options-object="userOptions"
                      :return-object="true"
                    >
                      <template #default="{ option }">
                        <div
                          class="info-tag !rounded-full capitalize w-6 h-6 mr-3"
                        >
                          {{ option.username[0] }}
                        </div>
                      </template>
                    </Dropdown>
                  </PopoverPanel>
                </transition>
              </Popover>
            </div>
            <Menu
              v-if="!isClosed"
              as="div"
              class="relative inline-block text-left"
            >
              <div>
                <MenuButton
                  class="info-button ml-2"
                >
                  <DotsVerticalIcon
                    aria-hidden="true"
                    class="h-4 w-4 text-white"
                  />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="z-20 absolute right-0 -translate-y-1 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-info-dark text-white' : 'text-gray-900',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        ]"
                        @click.prevent="() => handleCloseProject()"
                      >
                        Close Project
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
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
          <div class="mt-6">
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
          </div>
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
    </fieldset>
    <DefaultModal
      v-model="visibleCloseConfirmationModal"
      description=""
      :has-icon="false"
      :is-close-on-confirm="false"
      :loading="loadingClose"
      title="Close Project"
      type="success"
      @confirm="confirmClose"
    >
      <template #default>
        <div class="flex flex-col mb-4 mt-12 space-y-4">
          <div class="flex flex-col">
            <p class="text-sm font-semibold mb-2">
              Status
            </p>
            <Switch
              v-model="projectClose.status"
              text-false="Lose"
              text-true="Win"
            />
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-semibold mb-2">
              Reason
            </p>
            <Input
              v-model="projectClose.reason"
              class="hover-input h-36 text-sm"
              placeholder="Write something"
              type="textarea"
            />
          </div>
        </div>
      </template>
    </DefaultModal>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, reactive, watch, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { PlusIcon, DotsVerticalIcon } from '@heroicons/vue/solid'
import { Popover, PopoverButton, PopoverPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

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
const project: Ref<Project> = ref()

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
