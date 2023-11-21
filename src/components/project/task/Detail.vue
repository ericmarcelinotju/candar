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
          <div class="flex flex-row justify-between items-center">
            <div class="flex items-center">
              <input
                id="is-finish"
                v-model="projectTask.isFinish"
                class="default-input cursor-pointer"
                :class="[ projectTask.isFinish ? 'accent-success-dark' : 'accent-info-dark' ]"
                type="checkbox"
              >
              <label
                class="mr-3 font-semibold cursor-pointer"
                :class="[ projectTask.isFinish ? 'text-success-dark' : 'text-info-dark' ]"
                for="is-finish"
              >
                {{ projectTask.isFinish ? 'DONE' : 'PENDING' }}
              </label>
            </div>
            <div
              v-if="hasType"
              class="group relative success-tag !rounded-xl !p-0 h-[1.6rem]"
            >
              <div class="px-3 whitespace-nowrap">
                {{ snakeToTitle(projectTask.type) }}
              </div>

              <div
                class="group-hover:block hidden absolute top-0 right-0 ml-1 leading-[22px] pb-[0.2rem] px-2 text-white bg-success-dark rounded-xl cursor-pointer font-bold"
                @click="removeType"
              >
                x
              </div>
            </div>

            <Popover
              v-else
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
                    v-model="projectTask.type"
                    class="default-input"
                    :options="typeOptions"
                  />
                </PopoverPanel>
              </transition>
            </Popover>
          </div>
          <div class="-ml-3">
            <input
              v-model="projectTask.name"
              class="mt-3 hover-input font-bold text-xl"
              type="text"
            >
          </div>
          <div class="-ml-3">
            <textarea
              v-model="projectTask.description"
              class="hover-input h-36 text-sm"
              placeholder="Write something"
            />
          </div>

          <div>
            <p class="text-md mt-3 mb-2">
              Attendees
            </p>
            <div class="flex gap-2">
              <Popover class="relative">
                <PopoverButton>
                  <InfoButton info="Add Attendees">
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
                    class="absolute left-0 z-10 mt-2 w-screen max-w-sm transform px-4 sm:px-0"
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
                v-for="attendee in projectTask.attendees"
                :key="attendee"
                class="group relative info-tag !rounded-xl !p-0 h-[1.6rem]"
              >
                <div class="px-3">
                  {{ attendee }}
                </div>

                <div
                  class="group-hover:block hidden absolute top-0 right-0 ml-1 py-[0.2rem] px-2 text-white bg-info-dark rounded-xl cursor-pointer font-bold"
                  @click="removeAttendee"
                >
                  x
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 border-l px-3">
          <div>
            <p class="text-md">
              Picture
            </p>
            <div>
              <input
                ref="inputPicture"
                accept="image/*"
                style="display: none"
                type="file"
                @change="(e) => onFileChange(e, onPictureChange)"
              >
              <div
                v-if="tempPicture || projectTask.picture"
                class="group relative mt-3 text-sm border w-fit p-2 rounded-md hover:bg-grey-soft cursor-pointer"
                @click="handlePicture"
              >
                <img
                  v-if="tempPicture"
                  class="h-36 group-hover:grayscale"
                  :src="tempPicture"
                >
                <img
                  v-else
                  class="h-36 group-hover:grayscale"
                  :src="`${config.apiAddress}\\${projectTask.picture}`"
                >
                <PencilAltIcon class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-white" />
              </div>
              <p
                v-else
                class="mt-3 text-sm"
              >
                <FileInput
                  id="picture"
                  accept="image/*"
                  info="SVG, PNG, JPG or GIF"
                  label="Drop picture to Upload, or"
                  name="picture"
                  @change="onPictureChange"
                />
              </p>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-md">
              Attachment
            </p>
            <div>
              <input
                ref="inputAttachment"
                style="display: none"
                type="file"
                @change="(e) => onFileChange(e, onAttachmentChange)"
              >
              <a
                v-if="projectTask.attachment"
                class="group block mt-3 text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
                download
                :href="`${config.apiAddress}\\${projectTask.attachment}`"
                target="_blank"
              >
                <DocumentIcon class="w-4 h-4 inline mb-[0.15rem]" />
                {{ getAttachmentName(projectTask.attachment) }}

                <PencilAltIcon
                  class="hidden group-hover:block w-3 h-3 m-1 float-right"
                  @click.stop.prevent="handleAttachment"
                />
              </a>
              <p
                v-else
                class="mt-3 text-sm"
              >
                <FileInput
                  ref="inputAttachment"
                  @change="onAttachmentChange"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import Multiselect from 'vue-multiselect'
import { useI18n } from 'vue-i18n'
import { watchDebounced } from '@vueuse/core'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { UserAddIcon, PencilAltIcon, TagIcon } from '@heroicons/vue/solid'
import { DocumentIcon } from '@heroicons/vue/outline'
import { config } from '@/config'
import { Option } from '@/typings/option.type'
import { ProjectTask } from '@/typings/models/project-task.type'
import { update as updateProjectTask, detail as getProjectTask } from '@/api/project-task'
import { get as getAttendees } from '@/api/task-attendee'
import { useNotify } from '@/composables/use-notify'
import FileInput from '@/components/form/File.vue'
import InfoButton from '@/components/helper/InfoButton.vue'
import Dropdown from '@/components/form/dropdown/Dropdown.vue'
import { jsonToFormData } from '@/utils'
import { snakeToTitle } from '@/utils/string'

interface Props {
  data: ProjectTask
}

const props = defineProps<Props>()
const emit = defineEmits(['update'])
const { t } = useI18n()
const { notify } = useNotify('task')

const isLoaded = ref(false)
const loading = ref(true)
const projectTask: Ref<ProjectTask> = ref()

watch(
  () => props.data,
  (val) => {
    if (val) {
      getProjectTask(val.id)
        .then((res) => {
          projectTask.value = res.data
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
  projectTask,
  () => {
    if (!isLoaded.value) { return }
    saveLoading.value = true

    const payload = jsonToFormData(projectTask.value)
    updateProjectTask(projectTask.value.id, payload)
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

// Type
const hasType = computed(() => projectTask.value.type)
const removeType = () => (projectTask.value.type = null)
const typeOptions: Ref<Option[]> = ref([
  { label: t('project.task.call'), value: 'call' },
  { label: t('project.task.email'), value: 'email' },
  { label: t('project.task.meeting'), value: 'meeting' },
  { label: t('project.task.note'), value: 'note' },
  { label: t('project.task.task'), value: 'task' }
])

// Attendees
const attendees: Ref<string[]> = ref([])
const attendeeOptions = computed(() => attendees.value?.filter(option => projectTask.value?.attendees?.indexOf(option) === -1))
onMounted(() => {
  getAttendeesOption()
})
const getAttendeesOption = () => {
  getAttendees()
    .then(res => {
      attendees.value = [...res.data?.attendees]
    })
}
const addAttendee = (close, attendee) => {
  if (projectTask.value.attendees?.indexOf(attendee) === -1) {
    projectTask.value.attendees.push(attendee)
  }
  close()
}
const removeAttendee = (attendee) => {
  projectTask.value.attendees.splice(projectTask.value.attendees?.indexOf(attendee), 1)
}

// Picture
const inputPicture = ref(null)
const tempPicture = ref('')
const handlePicture = () => {
  inputPicture.value.click()
}
const onPictureChange = (file) => {
  const url = URL.createObjectURL(file)

  tempPicture.value = url
  projectTask.value.picture = file
}

// Attachment
const inputAttachment = ref(null)
const handleAttachment = () => {
  inputAttachment.value.click()
}
const getAttachmentName = (attachment: File | string) => {
  if (typeof attachment === 'string') {
    const strs = attachment.split('\\')
    return strs[strs.length - 1]
  }

  return attachment.name
}
const onAttachmentChange = (file) => {
  projectTask.value.attachment = file
}

const onFileChange = (e, cb) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  cb(files[0])
}
</script>
