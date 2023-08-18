<template>
  <div class="col-span-9 p-6">
    <div class="grid grid-cols-4 gap-6">
      <!-- <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.branch") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.extension") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold">
            {{ $t("app.columns.recording") }}
          </span>
        </div>
      </div>
      <div class="md:col-span-6 col-span-12 bg-white shadow">
        <div class="stat-label">
          100
        </div>
        <hr>
        <div class="flex justify-between items-center p-4">
          <span class="font-bold"> Logged In Users </span>
        </div>
      </div> -->

      <div class="project-list">
        <h3 class="font-semibold ml-2">
          Cold Call
        </h3>
        <Draggable
          v-model="projectsColdCall"
          class="project-group"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          group="people"
          item-key="id"
          v-bind="dragOptions"
          @end="drag = false"
          @start="drag = true"
        >
          <template #item="{ element, index }">
            <div class="project-item">
              <div class="flex gap-1 mb-2">
                <div class="info-tag">
                  tag 1
                </div>
                <div class="danger-tag">
                  tag 2
                </div>
              </div>
              <div>
                {{ element.name }} {{ index }}
              </div>
              <div class="flex justify-end mt-2">
                <div class="warning-tag !rounded-full">
                  N
                </div>
              </div>
              <PencilIcon class="edit-icon" />
            </div>
          </template>
        </Draggable>
      </div>

      <div class="project-list">
        <h3 class="font-semibold ml-2">
          Qualification
        </h3>
        <Draggable
          v-model="projectsQualification"
          class="project-group"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          group="people"
          item-key="id"
          v-bind="dragOptions"
          @end="drag = false"
          @start="drag = true"
        >
          <template #item="{ element, index }">
            <div class="project-item">
              <div class="flex gap-1 mb-2">
                <div class="info-tag">
                  tag 1
                </div>
                <div class="danger-tag">
                  tag 2
                </div>
              </div>
              <div>
                {{ element.name }} {{ index }}
              </div>
              <div class="flex justify-end mt-2">
                <div class="warning-tag !rounded-full">
                  N
                </div>
              </div>
              <PencilIcon class="edit-icon" />
            </div>
          </template>
        </Draggable>
      </div>

      <div class="project-list">
        <h3 class="font-semibold ml-2">
          Lead
        </h3>
        <Draggable
          v-model="projectsLead"
          class="project-group"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          group="people"
          item-key="id"
          v-bind="dragOptions"
          @end="drag = false"
          @start="drag = true"
        >
          <template #item="{ element, index }">
            <div class="project-item">
              <div class="flex gap-1 mb-2">
                <div class="info-tag">
                  tag 1
                </div>
                <div class="danger-tag">
                  tag 2
                </div>
              </div>
              <div>
                {{ element.name }} {{ index }}
              </div>
              <div class="flex justify-end mt-2">
                <div class="warning-tag !rounded-full">
                  N
                </div>
              </div>
              <PencilIcon class="edit-icon" />
            </div>
          </template>
        </Draggable>
      </div>

      <div class="project-list">
        <h3 class="font-semibold ml-2">
          Quotation
        </h3>
        <Draggable
          v-model="projectsQuotation"
          class="project-group"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          group="people"
          item-key="id"
          v-bind="dragOptions"
          @end="drag = false"
          @start="drag = true"
        >
          <template #item="{ element, index }">
            <div class="project-item">
              <div class="flex gap-1 mb-2">
                <div class="info-tag">
                  tag 1
                </div>
                <div class="danger-tag">
                  tag 2
                </div>
              </div>
              <div>
                {{ element.name }} {{ index }}
              </div>
              <div class="flex justify-end mt-2">
                <div class="warning-tag !rounded-full">
                  N
                </div>
              </div>
              <PencilIcon class="edit-icon" />
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Draggable from 'vuedraggable'
import { Project } from '@/typings/models/project.type'
import dayjs from 'dayjs'
import { inspectionDetail } from '@/router/routes/inspection'
import { PencilIcon } from '@heroicons/vue/solid'

const router = useRouter()
const store = useStore()

const projectsColdCall = ref([
  {
    id: '1',
    number: '1',
    name: 'Sales Lead A',
    status: 'cold_call'
  },
  {
    id: '2',
    number: '2',
    name: 'Sales Lead B',
    status: 'cold_call'
  }
])

const projectsQualification = ref([
  {
    id: '3',
    number: '3',
    name: 'Sales Lead C',
    status: 'qualification'
  },
  {
    id: '4',
    number: '4',
    name: 'Sales Lead D',
    status: 'qualification'
  }
])

const projectsLead = ref([
  {
    id: '5',
    number: '5',
    name: 'Sales Lead E',
    status: 'lead'
  }
])

const projectsQuotation = ref([])

const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
})

const drag = ref(false)

const initPage = () => {
  // getInspections()
  //   .then(res => {
  //     inspections.value = res.data.inspections
  //   })
}

onMounted(() => {
  initPage()
})

const hasPermission = (module) => {
  return store.getters['auth/hasPermission'](module, 'GET')
}
</script>

<style lang="scss" scoped>
.project-list {
  @apply flex flex-col min-h-[164px] h-fit bg-grey rounded-lg p-3;
  .project-group {
    @apply flex-1 h-full flex flex-col gap-2 mt-4;
    .project-item {
      @apply relative p-2 bg-white rounded-lg text-sm shadow-md;

      .edit-icon {
        @apply absolute top-2 right-3 w-4 h-4 text-grey-dark hidden;
      }

      &:hover {
        @apply bg-grey-soft;

        .edit-icon {
          @apply block;
        }
      }
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
}
</style>
