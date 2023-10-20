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
            <InfoButton
              v-if="hasType"
              info="Task Type"
            >
              <div

                class="group relative success-tag !rounded-lg !p-0 h-[1.6rem] hover:cursor-pointer mb-1"
              >
                <div class="px-3">
                  {{ projectTask.type }}
                </div>
              </div>
            </InfoButton>
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
                @change="onPictureChange"
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
              <p
                v-if="projectTask.attachment"
                class="mt-3 text-sm border border-transparent hover:border-grey p-1 rounded-md cursor-pointer"
              >
                <DocumentIcon class="w-3 h-3 inline mb-[0.15rem]" />
                {{ getAttachmentName(projectTask.attachment) }}
              </p>
              <p
                v-else
                class="mt-3 text-sm"
              >
                <FileInput @change="onAttachmentChange" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import Multiselect from 'vue-multiselect'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { UserAddIcon, PencilAltIcon } from '@heroicons/vue/solid'
import { DocumentIcon } from '@heroicons/vue/outline'

import { config } from '@/config'
import { update as updateProjectTask, detail as getProjectTask } from '@/api/project-task'
import { ProjectTask } from '@/typings/models/project-task.type'
import { useNotify } from '@/composables/use-notify'
import FileInput from '@/components/form/File.vue'
import InfoButton from '@/components/helper/InfoButton.vue'
import { jsonToFormData } from '@/utils'

interface Props {
  data: ProjectTask
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

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
          res.data.type = 'Ini adalah type'
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

const hasType = computed(() => projectTask.value.type)

const attendeeOptions = computed(() => ['budi', 'bambang', 'udin'].filter(option => projectTask.value.attendees.indexOf(option) === -1))

const addAttendee = (close, attendee) => {
  if (projectTask.value.attendees?.indexOf(attendee) === -1) {
    projectTask.value.attendees.push(attendee)
  }
  close()
}

const removeAttendee = (attendee) => {
  projectTask.value.attendees.splice(projectTask.value.attendees?.indexOf(attendee), 1)
}

const inputPicture = ref(null)
const tempPicture = ref('')
const handlePicture = () => {
  inputPicture.value.click()
}
const onPictureChange = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return

  const url = URL.createObjectURL(files[0])

  tempPicture.value = url
  projectTask.value.picture = files[0]
}

const getAttachmentName = (attachment) => {
  const strs = attachment.split('\\')
  return strs[strs.length - 1]
}

const onAttachmentChange = (e) => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) return

  projectTask.value.attachment = files[0]
}
</script>
