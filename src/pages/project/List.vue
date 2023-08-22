<template>
  <DefaultPage :title="$t('app.module.project')">
    <!-- <DefaultTable
      :columns="columns"
      :has-delete="hasPermission('DELETE')"
      :has-edit="hasPermission('PUT')"
      :items="items"
      :loading="loading"
      :total="itemsTotal"
      @delete="handleDelete"
      @edit="handleEdit"
      @search="handleSearch"
    >
      <template #content="{ item }">
        <p v-html="item.content" />
      </template>
    </DefaultTable> -->

    <div class="mt-4 grid grid-cols-4 gap-6">
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

    <template #action>
      <button
        v-if="hasPermission('POST')"
        class="info-button mr-4"
        type="button"
        @click="handleCreate"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        {{ $t("app.create") }}
      </button>
    </template>
    <template #search>
      <DefaultSearch
        :columns="columns"
        :loading="loading"
        @search="handleSearch"
      />
    </template>
    <template #dialog>
      <DefaultModal
        v-model="visibleDeleteConfirmationModal"
        :loading="loadingDelete"
        type="danger"
        @confirm="confirmDelete"
      />
    </template>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import DefaultTable from '@/components/default/Table.vue'
import { get as getProjects, del as deleteProject } from '@/api/project'
import { useNotify } from '@/composables/use-notify'
import { Project } from '@/typings/models/project.type'
import { projectCreate, projectEdit } from '@/router/routes/project'
import Draggable from 'vuedraggable'

const router = useRouter()
const store = useStore()
const { notify } = useNotify('project')

const columns = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Name',
    key: 'name',
    isSearchable: true,
    isSortable: true
  },
  {
    label: 'Content',
    key: 'content'
  }
]

const loading = ref(false)
let stateParams = reactive({})

const items: Ref<Project[]> = ref([])
const itemsTotal = ref(0)
const handleSearch = (params) => {
  stateParams = { ...params }
  loading.value = true
  getProjects(params)
    .then(res => {
      items.value = res.data.projects
      itemsTotal.value = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCreate = () => {
  router.push(projectCreate)
}

const handleEdit = ({ id }) => {
  router.push({ ...projectEdit, params: { id } })
}

// Delete project
const loadingDelete = ref(false)
const visibleDeleteConfirmationModal = ref(false)
const deleteItem: Ref<Project> = ref()
const handleDelete = (data) => {
  visibleDeleteConfirmationModal.value = true
  deleteItem.value = data
}
const confirmDelete = () => {
  const { id } = deleteItem.value
  loadingDelete.value = true
  deleteProject(id)
    .then(() => {
      handleSearch(stateParams)
      notify('deleted')
    })
    .catch(() => {
      notify('deleted', 'danger')
    })
    .finally(() => {
      loadingDelete.value = false
      visibleDeleteConfirmationModal.value = false
    })
}

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

const hasPermission = (method, module = 'DEVICE') => {
  return store.getters['auth/hasPermission'](module, method)
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
