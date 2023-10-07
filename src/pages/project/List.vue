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
        description=""
        :has-cancel="false"
        :has-confirm="false"
        :has-icon="false"
        :loading="loadingDetail"
        title=""
        type="info"
      >
        <ProjectDetail :data="detailItem" />
      </DefaultModal>
    </template>
  </DefaultPage>
</template>

<script setup lang="ts">
import { Ref, computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PlusIcon } from '@heroicons/vue/solid'
import {
  get as getProjects,
  del as deleteProject,
  update as updateProject
} from '@/api/project'
import { useNotify } from '@/composables/use-notify'
import { Project } from '@/typings/models/project.type'
import { projectCreate, projectEdit } from '@/router/routes/project'
import Draggable from 'vuedraggable'
import ProjectCard from './Card.vue'
import ProjectDetail from './Detail.vue'

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

const handleEdit = ({ id }) => {
  router.push({ ...projectEdit, params: { id } })
}

// Detail project
const loadingDetail = ref(false)
const visibleDetailModal = ref(false)
const detailItem: Ref<Project> = ref()
const handleDetail = (data) => {
  visibleDetailModal.value = true
  detailItem.value = data
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
  get: () => items.value.filter((item) => item.status === 'initiate'),
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
  get: () => items.value.filter((item) => item.status === 'qualification'),
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
  get: () => items.value.filter((item) => item.status === 'lead'),
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
  get: () => items.value.filter((item) => item.status === 'quotation'),
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
