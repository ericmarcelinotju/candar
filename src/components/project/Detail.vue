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
        <div class="flex-[1_1_11%] px-3">
          <div class="flex flex-row justify-between gap-2 mb-2">
            <div class="flex flex-row gap-2">
              <div
                v-if="isNeedQuotation"
                class="warning-tag cursor-pointer hover:bg-warning-dark"
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
              <div
                v-if="isAlmostExpired"
                class="danger-tag"
              >
                Antention Needed
              </div>
              <Popover
                v-slot="{ open }"
                class="relative"
              >
                <PopoverButton @click="() => handleClickUser(open)">
                  <div class="flex justify-end p-0.5 hover:cursor-pointer hover:opacity-70 rounded-full">
                    <div v-if="avatar">
                      <img
                        class="avatar"
                        :src="avatar"
                      >
                    </div>
                    <div
                      v-else
                      class="info-tag !rounded-full capitalize"
                    >
                      {{ userInitial }}
                    </div>
                  </div>
                  <!-- <button
                    class="rounded-full border border-dashed border-grey p-1"
                    type="button"
                  >
                    <UserAddIcon class="w-4 h-4 text-grey" />
                  </button> -->
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
                  class="z-20 absolute right-0 -translate-y-1 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                        <XIcon
                          :active="active"
                          aria-hidden="true"
                          :class="[active ? 'text-white' : 'text-black', 'mr-2 h-5 w-5']"
                        />
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
        </div>
        <div class="flex-1 border-l px-3">
          <div class="flex gap-3 text-xs font-semibold">
            <div class="p-2">
              <p class="mb-1 text-grey-dark">
                CREATED
              </p>
              <p>{{ project.createdAt }}</p>
            </div>

            <div class="w-[0.05rem] bg-grey" />

            <div class="pt-2 px-2">
              <p class="text-grey-dark">
                DUE DATE
              </p>
              <Datepicker
                v-model="project.dueDate"
                auto-apply
                :clearable="false"
                :enable-time-picker="false"
              >
                <template #trigger>
                  <div class="hover:bg-gray-200 p-1 transition duration-300 rounded-md -translate-x-1">
                    <InfoButton
                      v-if="project.dueDate"
                      :info="formatDate(project.dueDate)"
                    >
                      <!-- <p>{{ project.createdAt }}</p> -->
                      <p class="text-xs font-medium">
                        {{ formatDate(project.dueDate) }}
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
    <DefaultModal
      v-model="visibleDeleteConfirmationModal"
      :loading="loadingDelete"
      type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { PlusIcon, DotsVerticalIcon, XIcon } from '@heroicons/vue/solid'
import { Popover, PopoverButton, PopoverPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import Datepicker from '@vuepic/vue-datepicker'
import InfoButton from '@/components/helper/InfoButton.vue'

import { Project, getProjectStatusColor } from '@/typings/models/project.type'
import { update as updateProject, detail as getProject } from '@/api/project'
import { get as getUser } from '@/api/user'
import { useProject } from '@/composables/use-project'
import TaskForm from '@/components/project/task/Form.vue'
import { useNotify } from '@/composables/use-notify'
import { snakeToTitle } from '@/utils/string'
import { User } from '@/typings/models/user.type'
import { quotationCreate, quotationList } from '@/router/routes/quotation'

interface Props {
  data: Project
}
const props = defineProps<Props>()
const emit = defineEmits(['update', 'detail:task', 'close'])
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
      payload.user_id = payload.user?.id
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

const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}

// Delete client
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)

const handleCloseProject = () => {
  visibleDeleteConfirmationModal.value = true
}

const confirmDelete = () => {
  const { id } = project.value
  loadingDelete.value = true
  setTimeout(() => {
    console.log(id)
    loadingDelete.value = false
    emit('close')
  }, 2000)
  // deleteProduct(id)
  //   .then(() => {
  //     notify('deleted')
  //     emit('close')
  //   })
  //   .catch(() => {
  //     notify('deleted', 'danger')
  //   })
  //   .finally(() => {
  //     loadingDelete.value = false
  //     visibleDeleteConfirmationModal.value = false
  //   })
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

const avatar = computed(() => {
  return project.value.user?.avatar
})

const userInitial = computed(() => {
  return project.value.user?.username[0]
})

const {
  // avatar,
  // userInitial,
  isAlmostExpired,
  isNeedQuotation,
  isQuoted,
  hasTag
} = useProject(props.data)
</script>
