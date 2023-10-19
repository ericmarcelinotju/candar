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
      <input
        v-else-if="taskPayload.id"
        v-model="taskPayload.isFinish"
        class="default-input"
        type="checkbox"
      >
    </div>

    <input
      v-model="taskPayload.name"
      class="w-full px-3 py-2 rounded-md border border-grey-soft focus:ring-info-dark focus:border-info-dark text-sm"
      :class="taskPayload.id ? '!pl-9' : ''"
      placeholder="Write something"
      type="text"
    >
    <div class="absolute top-0 right-0 flex gap-1 m-[0.35rem]">
      <div
        v-for="attendee in taskPayload.attendees"
        :key="attendee"
        class="group relative info-tag !rounded-xl !p-0 h-[1.6rem]"
      >
        <div class="px-3">
          {{ attendee }}
        </div>

        <div
          class="group-hover:block hidden absolute top-0 right-0 ml-1 py-[0.2rem] px-2 text-white bg-info-dark rounded-xl cursor-pointer font-bold"
          @click="removeAttendee(attendee)"
        >
          x
        </div>
      </div>

      <Popover class="relative">
        <PopoverButton>
          <InfoButton info="Add Assignee">
            <button
              class="rounded-full border border-dashed border-grey p-1"
              type="button"
            >
              <UserAddIcon class="w-4 h-4 text-grey" />
            </button>
          </InfoButton>
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
            v-slot="{ close }"
            class="absolute left-0 z-10 mt-2 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0"
          >
            <Multiselect
              :options="attendeeOptions"
              placeholder="Select one"
              :taggable="true"
              @select="(value) => addAttendee(close, value)"
              @tag="(value) => addAttendee(close, value)"
            />
          </PopoverPanel>
        </transition>
      </Popover>

      <div
        v-if="taskPayload.type"
        class="group relative success-tag !rounded-xl !p-0 h-[1.6rem]"
      >
        <div class="px-3">
          {{ taskPayload.type }}
        </div>

        <div
          class="group-hover:block hidden absolute top-0 right-0 ml-1 py-[0.2rem] px-2 text-white bg-success-dark rounded-xl cursor-pointer font-bold"
          @click="removeType"
        >
          x
        </div>
      </div>

      <Popover
        v-if="!hasType"
        class="relative"
      >
        <PopoverButton>
          <InfoButton info="Set Type">
            <button
              class="rounded-full border border-dashed border-grey p-1"
              type="button"
            >
              <TagIcon class="w-4 h-4 text-grey" />
            </button>
          </InfoButton>
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
            class="absolute bg-white left-0 z-10 mt-2 min-w-[180px] max-w-sm -translate-x-1/2 transform px-4 sm:px-0"
          >
            <Dropdown
              v-model="taskPayload.type"
              class="default-input"
              :options="typeOptions"
            />
          </PopoverPanel>
        </transition>
      </Popover>

      <Datepicker
        v-model="taskPayload.date"
        auto-apply
        :clearable="false"
        :enable-time-picker="false"
      >
        <template #trigger>
          <div>
            <InfoButton
              v-if="taskPayload.date"
              :info="formatDate(taskPayload.date)"
            >
              <div class="h-6 font-semibold text-xs leading-6">
                {{ formatDate(taskPayload.date) }}
              </div>
            </InfoButton>
            <InfoButton
              v-else
              info="Set Date"
            >
              <button
                class="rounded-full border border-dashed border-grey p-1"
                type="button"
              >
                <CalendarIcon class="w-4 h-4 text-grey" />
              </button>
            </InfoButton>
          </div>
        </template>
      </Datepicker>

      <input
        ref="inputPicture"
        accept="image/*"
        style="display: none"
        type="file"
        @change="onPictureChange"
      >
      <InfoButton info="Set Picture">
        <button
          class="rounded-full border border-dashed p-1"
          :class="taskPayload.picture ? 'border-info-dark text-info-dark' : 'border-grey text-grey'"
          type="button"
          @click="handlePicture"
        >
          <PhotographIcon class="w-4 h-4" />
        </button>
      </InfoButton>

      <input
        ref="inputAttachment"
        style="display: none"
        type="file"
        @change="onAttachmentChange"
      >
      <InfoButton info="Set Attachment">
        <button
          class="rounded-full border border-dashed p-1"
          :class="taskPayload.attachment ? 'border-info-dark text-info-dark' : 'border-grey text-grey'"
          type="button"
          @click="handleAttachment"
        >
          <PaperClipIcon class="w-4 h-4" />
        </button>
      </InfoButton>

      <Menu
        v-if="taskPayload.id"
        as="div"
        class="relative inline-block text-left"
      >
        <div>
          <MenuButton>
            <button
              class="rounded-full p-1"
              type="button"
            >
              <DotsHorizontalIcon class="w-5 h-5 text-grey-dark" />
            </button>
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
            class="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active && 'bg-grey-soft',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                  type="button"
                  @click="detailTask"
                >
                  <EyeIcon
                    :active="active"
                    aria-hidden="true"
                    class="mr-2 h-5 w-5"
                  />
                  Detail
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active && 'bg-grey-soft',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-danger',
                  ]"
                  type="button"
                  @click="deleteTask"
                >
                  <TrashIcon
                    :active="active"
                    aria-hidden="true"
                    class="mr-2 h-5 w-5 text-danger"
                  />
                  Delete
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import Datepicker from '@vuepic/vue-datepicker'
import Multiselect from 'vue-multiselect'
import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { CalendarIcon, UserAddIcon, PaperClipIcon, PhotographIcon, DotsHorizontalIcon, TrashIcon, EyeIcon, TagIcon } from '@heroicons/vue/solid'
import { Option } from '@/typings/option.type'

import { Project } from '@/typings/models/project.type'
import { ProjectTask } from '@/typings/models/project-task.type'
import { insert as insertProjectTask, update as updateProjectTask, del as deleteProjectTask } from '@/api/project-task'
import InfoButton from '@/components/helper/InfoButton.vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import { jsonToFormData } from '@/utils'

const defaultTaskPayload = {
  id: null,
  name: null,
  description: null,
  date: null,
  attendees: [],
  type: null,
  picture: null,
  attachment: null
} as ProjectTask

interface Props {
  project: Project
  task?: ProjectTask
}

const props = withDefaults(defineProps<Props>(), {
  task: () => ({
    name: null,
    description: null,
    date: null,
    attendees: [],
    type: null,
    picture: null,
    attachment: null
  } as ProjectTask)
})

const emit = defineEmits(['insert', 'update', 'delete', 'detail'])

const loading = ref(false)
const taskPayload = ref(props.task)

const submitTask = () => {
  loading.value = true

  const payload = jsonToFormData({
    ...taskPayload.value,
    projectId: props.project.id
  })


  if (taskPayload.value.id) {
    updateProjectTask(taskPayload.value.id, payload)
      .then(() => {
        emit('update', { ...taskPayload })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    insertProjectTask(payload)
      .then(() => {
        console.log('insertProjectTask')
        emit('insert', { ...taskPayload })
      })
      .finally(() => {
        taskPayload.value = { ...defaultTaskPayload }
        loading.value = false
      })
  }
}

const hasType = computed(() => taskPayload.value.type)

const removeType = () => (taskPayload.value.type = null)

watch(() => taskPayload.value.type, (val) => {
  console.log(val)
})

watchDebounced(
  taskPayload,
  () => {
    // Only auto submit if update\
    if (taskPayload.value.id) {
      submitTask()
    }
  },
  {
    deep: true,
    debounce: 1000,
    maxWait: 1000
  }
)

const detailTask = () => {
  emit('detail', props.task)
}

const deleteTask = () => {
  loading.value = true

  deleteProjectTask(props.task.id)
    .then(() => {
      emit('delete', taskPayload)
    })
    .finally(() => {
      loading.value = false
    })
}

const inputPicture = ref(null)

const handlePicture = () => {
  inputPicture.value.click()
}

const onPictureChange = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return

  taskPayload.value.picture = files[0]
}

const inputAttachment = ref(null)

const handleAttachment = () => {
  inputAttachment.value.click()
}

const onAttachmentChange = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return

  taskPayload.value.attachment = files[0]
}

const typeOptions: Ref<Option[]> = ref([
  { label: 'Task', value: 'task' },
  { label: 'Bugs', value: 'bugs' }
])

const attendeeOptions = computed(() => ['budi', 'bambang', 'udin'].filter(option => taskPayload.value.attendees?.indexOf(option) === -1))

const addAttendee = (close, attendee) => {
  if (taskPayload.value.attendees?.indexOf(attendee) === -1) {
    taskPayload.value.attendees.push(attendee)
  }
  close()
}

const removeAttendee = (attendee) => {
  taskPayload.value.attendees.splice(taskPayload.value.attendees?.indexOf(attendee), 1)
}

const formatDate = (date) => {
  return dayjs(date).format('MMM DD')
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
