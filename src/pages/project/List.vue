<template>
  <DefaultPage :title="$t('module.project')">
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
    <div class="ml-3 mt-4 flex gap-2">
      <Switch
        v-model="isClosedProjectsShown"
        :label="$t('tip.show_close_project')"
      />
    </div>
    <div
      class="mt-4 grid"
      :class="[
        isClosedProjectsShown ?
          'grid-cols-6 gap-4' : 'grid-cols-4 gap-6'
      ]"
    >
      <div class="project-list">
        <h3 class="font-semibold ml-2">
          {{ $t('project.initiate') }}
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
          {{ $t('project.qualification') }}
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
          {{ $t('project.lead') }}
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
          {{ $t('project.quotation') }}
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
      <template v-if="isClosedProjectsShown">
        <div class="project-list">
          <h3 class="font-semibold ml-2">
            {{ $t('project.win') }}
          </h3>
          <Draggable
            v-model="projectsWin"
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
            {{ $t('project.lose') }}
          </h3>
          <Draggable
            v-model="projectsLose"
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
      </template>
    </div>
    <div
      class="mt-9 grid"
      :class="[
        isClosedProjectsShown ?
          'grid-cols-6 gap-4' : 'grid-cols-4 gap-6'
      ]"
    >
      <div>
        <div class="text-sm font-semibold">
          {{ $t('project.totalEstimate') }}
        </div>
        {{ formatCurrency(projectsInitiateTotalEstimate) }}
      </div>
      <div>
        <div class="text-sm font-semibold">
          {{ $t('project.totalEstimate') }}
        </div>
        {{ formatCurrency(projectsQualificationTotalEstimate) }}
      </div>
      <div>
        <div class="text-sm font-semibold">
          {{ $t('project.totalEstimate') }}
        </div>
        {{ formatCurrency(projectsLeadTotalEstimate) }}
      </div>
      <div>
        <div class="text-sm font-semibold">
          {{ $t('project.total') }}
        </div>
        {{ formatCurrency(projectsQuotationTotalEstimate) }}
      </div>
      <template v-if="isClosedProjectsShown">
        <div>
          <div class="text-sm font-semibold">
            {{ $t('project.total') }}
          </div>
          {{ formatCurrency(projectsWinTotalEstimate) }}
        </div>
        <div>
          <div class="text-sm font-semibold">
            {{ $t('project.total') }}
          </div>
          {{ formatCurrency(projectsLoseTotalEstimate) }}
        </div>
      </template>
    </div>

    <template #action>
      <div class="flex flex-row">
        <button
          v-if="hasPermission('POST')"
          class="info-button mr-4"
          type="button"
          @click="handleCreate"
        >
          <PlusIcon class="w-4 h-4 mr-1" />
          {{ $t('app.create') }}
        </button>
      </div>
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
        <template #default="{ close }">
          <ProjectDetail
            :data="detailItem"
            @close="close"
            @detail:cost="handleCostDetail"
            @detail:task="handleTaskDetail"
            @update="onProjectUpdate"
          />
        </template>
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
      <DefaultModal
        v-model="visibleCostDetailModal"
        class-name="!max-w-7xl"
        description=""
        :has-cancel="false"
        :has-confirm="false"
        :has-icon="false"
        :loading="loadingCostDetail"
        title=""
        type="info"
      >
        <ProjectCostDetail :data="detailCostItem" />
      </DefaultModal>
      <DefaultModal
        v-model="visiblePriorityModal"
        class-name="!max-w-3xl"
        description="Update the current priority of this deal."
        :has-icon="false"
        :loading="loadingPriority"
        title="Update Deal Priority"
        type="info"
        @confirm="onConfirmPriority"
      >
        <ProjectPriority
          v-model="priorityItem.priority"
          :data="priorityItem"
        />
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

import Switch from '@/components/form/Switch.vue'

import ProjectCard from '@/components/project/Card.vue'
import ProjectDetail from '@/components/project/detail/Index.vue'

import ProjectTaskDetail from '@/components/project/task/Detail.vue'
import { ProjectTask } from '@/typings/models/project-task.type'

import ProjectCostDetail from '@/components/project/cost/Detail.vue'
import { ProjectCost } from '@/typings/models/project-cost.type'

import ProjectPriority from '@/components/project/Priority.vue'

import { formatCurrency } from '@/utils/number'

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
      items.value = res.data.data
      itemsTotal.value = res.data.totalItem
    })
    .finally(() => {
      loading.value = false
    })
}
handleSearch({})

const handleCreate = () => {
  router.push(projectCreate)
}

const isClosedProjectsShown: Ref<boolean> = ref(false)

// Detail project
const loadingDetail = ref(false)
const visibleDetailModal = ref(false)
const detailItem: Ref<Project> = ref()
const handleDetail = (data: Project) => {
  visibleDetailModal.value = true
  detailItem.value = { ...data }
}

// Detail project task
const loadingTaskDetail = ref(false)
const visibleTaskDetailModal = ref(false)
const detailTaskItem: Ref<ProjectTask> = ref()
const handleTaskDetail = (data: ProjectTask) => {
  visibleDetailModal.value = false
  detailItem.value = null

  visibleTaskDetailModal.value = true
  detailTaskItem.value = { ...data }
}

// Detail project Cost
const loadingCostDetail = ref(false)
const visibleCostDetailModal = ref(false)
const detailCostItem: Ref<ProjectCost> = ref()
const handleCostDetail = (data: ProjectCost) => {
  visibleDetailModal.value = false
  detailItem.value = null

  visibleCostDetailModal.value = true
  detailCostItem.value = { ...data }
}

// Detail project priority
const loadingPriority = ref(false)
const visiblePriorityModal = ref(false)
const priorityItem: Ref<Project> = ref()
const handlePriority = (data: Project) => {
  visiblePriorityModal.value = true
  priorityItem.value = { ...data }
}
const onConfirmPriority = () => {
  updateProject(priorityItem.value.id, {
    ...priorityItem.value,
    expiredAt: new Date(priorityItem.value.expiredAt)
  })
    .catch((err) => {
      notify('update', 'danger', err.message)
    })
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

const updatePrj = (payload: Project) => {
  return updateProject(payload.id, {
    ...payload,
    expiredAt: new Date(payload.expiredAt)
  })
    .then(() => {
      handlePriority(payload)
    })
    .catch((err) => {
      notify('update', 'danger', err.message)
    })
}

const projectsInitiate = computed({
  get: () => [...items.value.filter((item) => item.status === 'initiate')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      const currStatus = val[i].status
      if (currStatus !== 'initiate') {
        val[i].status = 'initiate'

        updatePrj(val[i])
          .catch(() => {
            val[i].status = currStatus
          })
      }
    }
  }
})
const projectsInitiateTotalEstimate = computed(() => projectsInitiate.value.reduce((acc, item) => acc + item.estimate, 0))

const projectsQualification = computed({
  get: () => [...items.value.filter((item) => item.status === 'qualification')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      const currStatus = val[i].status
      if (currStatus !== 'qualification') {
        val[i].status = 'qualification'

        updatePrj(val[i])
          .catch(() => {
            val[i].status = currStatus
          })
      }
    }
  }
})
const projectsQualificationTotalEstimate = computed(() => projectsQualification.value.reduce((acc, item) => acc + item.estimate, 0))

const projectsLead = computed({
  get: () => [...items.value.filter((item) => item.status === 'lead')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      const currStatus = val[i].status
      if (currStatus !== 'lead') {
        val[i].status = 'lead'

        updatePrj(val[i])
          .catch(() => {
            val[i].status = currStatus
          })
      }
    }
  }
})
const projectsLeadTotalEstimate = computed(() => projectsLead.value.reduce((acc, item) => acc + item.estimate, 0))

const projectsQuotation = computed({
  get: () => [...items.value.filter((item) => item.status === 'quotation')],
  set: (val) => {
    for (let i = 0; i < val.length; i++) {
      const currStatus = val[i].status
      if (currStatus !== 'quotation') {
        val[i].status = 'quotation'

        updatePrj(val[i])
          .catch(() => {
            val[i].status = currStatus
          })
      }
    }
  }
})
const projectsQuotationTotalEstimate = computed(() => projectsQuotation.value.reduce((acc, item) => acc + item.estimate, 0))

const projectsWin = computed(() => [...items.value.filter((item) => item.status === 'win')])
const projectsWinTotalEstimate = computed(() => projectsWin.value.reduce((acc, item) => acc + item.estimate, 0))

const projectsLose = computed(() => [...items.value.filter((item) => item.status === 'lose')])
const projectsLoseTotalEstimate = computed(() => projectsLose.value.reduce((acc, item) => acc + item.estimate, 0))

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
