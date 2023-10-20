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
          v-model="projectsInitiate"
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
            <ProjectCard
              :data="element"
              :index="index"
              @click="handleDetail"
            />
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
            <ProjectCard
              :data="element"
              :index="index"
              @click="handleDetail"
            />
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
            <ProjectCard
              :data="element"
              :index="index"
              @click="handleDetail"
            />
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
            <ProjectCard
              :data="element"
              :index="index"
              @click="handleDetail"
            />
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
        {{ $t('app.create') }}
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
      <DefaultModal
        v-model="visibleDetailModal"
        class-name="!max-w-7xl"
        description=""
        :has-cancel="false"
        :has-confirm="false"
        :has-icon="false"
        :loading="loadingDetail"
        title=""
        type="info"
      >
        <ProjectDetail
          :data="detailItem"
          @detail:task="handleTaskDetail"
          @update="onProjectUpdate"
        />
      </DefaultModal>
      <DefaultModal
        v-model="visibleTaskDetailModal"
        class-name="!max-w-7xl"
        description=""
        :has-cancel="false"
        :has-confirm="false"
        :has-icon="false"
        :loading="loadingTaskDetail"
        title=""
        type="info"
      >
        <ProjectTaskDetail :data="detailTaskItem" />
      </DefaultModal>
    </template>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import {
  get as getProjects,
  del as deleteProject,
  update as updateProject,
  detail as getProject
} from '@/api/project'
import { detail as getProjectTask } from '@/api/project-task'
import { useNotify } from '@/composables/use-notify'
import { Project } from '@/typings/models/project.type'
import { projectCreate } from '@/router/routes/project'
import Draggable from 'vuedraggable'
import ProjectCard from '@/components/project/Card.vue'
import ProjectDetail from '@/components/project/Detail.vue'
import ProjectTaskDetail from '@/components/project/task/Detail.vue'
import { ProjectTask } from '@/typings/models/project-task.type'

const route = useRoute()
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
    .then((res) => {
      // Dont Forget to Erase this code #ERASE_CODE
      res.data.data.map(res => {
        res.dueDate = ''
        return res
      })
      items.value = res.data.data
      itemsTotal.value = res.data.total_item
    })
    .finally(() => {
      loading.value = false
    })
}
handleSearch({})

const handleCreate = () => {
  router.push(projectCreate)
}

// Detail project
const loadingDetail = ref(false)
const visibleDetailModal = ref(false)
const detailItem: Ref<Project> = ref()
const handleDetail = (data: Project) => {
  visibleDetailModal.value = true
  detailItem.value = { ...data }
  console.log(detailItem.value)
}

// Detail project task
const loadingTaskDetail = ref(false)
const visibleTaskDetailModal = ref(false)
const detailTaskItem: Ref<ProjectTask> = ref()
const handleTaskDetail = (data: ProjectTask) => {
  visibleDetailModal.value = false
  detailItem.value = null

  visibleTaskDetailModal.value = true
  detailTaskItem.value = data
}

const initPage = async () => {
  if (route.params.project_task_id) {
    const projectTaskResp = await getProjectTask(route.params.project_task_id as string)
    handleTaskDetail(projectTaskResp.data)
  } else if (route.params.project_id) {
    const projectResp = await getProject(route.params.project_id as string)
    handleDetail(projectResp.data)
  }
}

onMounted(() => {
  initPage()
})

const onProjectUpdate = (payload) => {
  items.value.splice(
    items.value.findIndex(item => item.id === payload.id),
    1,
    payload
  )
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

const projectsInitiate = computed({
  get: () => [...items.value.filter((item) => item.status === 'initiate')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i].status !== 'initiate') {
        val[i].status = 'initiate'

        updateProject(val[i].id, val[i]).catch((err) => {
          notify('update', 'danger', err.message)
        })
      }
    }
  }
})
const projectsQualification = computed({
  get: () => [...items.value.filter((item) => item.status === 'qualification')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i].status !== 'qualification') {
        val[i].status = 'qualification'

        updateProject(val[i].id, val[i]).catch((err) => {
          notify('update', 'danger', err.message)
        })
      }
    }
  }
})

const projectsLead = computed({
  get: () => [...items.value.filter((item) => item.status === 'lead')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i].status !== 'lead') {
        val[i].status = 'lead'

        updateProject(val[i].id, val[i]).catch((err) => {
          notify('update', 'danger', err.message)
        })
      }
    }
  }
})

const projectsQuotation = computed({
  get: () => [...items.value.filter((item) => item.status === 'quotation')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i].status !== 'quotation') {
        val[i].status = 'quotation'

        updateProject(val[i].id, val[i]).catch((err) => {
          notify('update', 'danger', err.message)
        })
      }
    }
  }
})

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
