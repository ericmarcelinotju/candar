<template>
  <div class="flex-auto min-h-0 flex flex-col">
    <div class="mb-3 flex justify-between items-end">
      <div class="inset-y-0 left-0 flex items-center" />
      <div
        v-if="hasSelection"
        class="right-0 flex items-center"
      >
        <slot name="selection-action" />
      </div>
    </div>
    <div class="align-middle min-w-full overflow-x-auto rounded-md shadow">
      <table
        class="min-w-full divide-y divide-gray-200"
        :style="tableStyle"
      >
        <thead
          class="bg-gray-100 outline outline-1 outline-gray-300 sticky top-0"
        >
          <tr>
            <th v-if="hasSelection">
              <div>
                <input
                  class="default-checkbox"
                  style="margin-right: 0"
                  type="checkbox"
                  @input="onSelectionInput"
                >
              </div>
            </th>
            <th v-if="hasDetail">
              <!-- Leave empty for header -->
            </th>
            <th
              v-for="column in filterColumns"
              :key="column.key"
              class="head"
              :class="column.class"
              scope="col"
              :title="column.label"
              :width="column.width"
              @click="setSort(column)"
            >
              <div>
                <span class="mr-1">
                  {{ column.label }}
                </span>
                <Component
                  :is="getSortingComponent(column)"
                  v-if="column.isSortable"
                  class="inline h-5 w-5 cursor-pointer"
                />
              </div>
            </th>
            <th
              v-if="hasEdit || hasDelete"
              class="head action"
            />
          </tr>
        </thead>
        <tbody>
          <template v-if="hasItems">
            <template
              v-for="(item, index) in items"
              :key="item.id"
            >
              <tr
                class="custom-table-row"
                :class="{ 'cursor-pointer': isClickable }"
                @click="onRowClick(item)"
              >
                <td v-if="hasDetail">
                  <a
                    class="cursor-pointer"
                    @click="onToogleDetail(index, item)"
                  >
                    <ChevronDownIcon
                      v-if="!isDetailOpens[index]"
                      class="h-6 w-6"
                    />
                    <ChevronUpIcon
                      v-else
                      class="h-6 w-6"
                    />
                  </a>
                </td>
                <td
                  v-for="column in filterColumns"
                  :key="column.key"
                  :class="column.class"
                >
                  <template v-if="$slots[column.key]">
                    <slot
                      :item="item"
                      :name="column.key"
                    />
                  </template>
                  <template v-else>
                    <span v-if="isDeep(column.key)">
                      {{ getValue(item, column.key) }}
                    </span>
                    <span v-else>
                      {{ item[column.key] }}
                    </span>
                  </template>
                </td>
                <td
                  v-if="hasEdit || hasDelete"
                  class="action"
                >
                  <slot
                    :item="item"
                    name="action"
                  />
                  <a
                    v-if="hasEdit"
                    class="edit mr-2"
                    @click="onEdit(item)"
                  >
                    <PencilIcon class="h-6 w-6 mr-1" />
                  </a>
                  <a
                    v-if="hasDelete"
                    class="delete"
                    @click="onDelete(item)"
                  >
                    <TrashIcon class="h-6 w-6 mr-1" />
                  </a>
                </td>
              </tr>
              <tr v-if="hasDetail && isDetailOpens[index]">
                <td colspan="100%">
                  <slot
                    :item="item"
                    name="detail"
                  />
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="columns.length">
                <div class="text-center p-12">
                  <template v-if="loading">
                    <img
                      alt="loading..."
                      class="mx-auto h-24 w-24"
                      src="@/assets/img/animated/loading.svg"
                    >
                    <h3 class="mb-3 mt-1 text-sm font-semibold text-gray-500">
                      {{ $t('app.components.table.loading.title') }}
                    </h3>
                  </template>
                  <template v-else>
                    <CloudIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">
                      {{
                        $t('app.components.table.emptyState.title', {
                          name
                        })
                      }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      {{ $t('app.components.table.emptyState.description') }}
                    </p>
                  </template>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="hasPagination"
      class="flex justify-between items-center mt-4"
    >
      <Pagination
        v-if="total"
        :current="pagination.page"
        :current-total="items.length"
        :per-page="pagination.limit"
        :total="total"
        @page-changed="(page) => (pagination.page = page)"
      />
      <label
        class="sr-only"
        for="item-per-page"
      >
        {{ $t('app.components.table.itemPerPageLabel') }}
      </label>
      <select
        id="item-per-page"
        v-model="pagination.limit"
        autocomplete="item-per-page"
        class="
          focus:ring-sky-700 focus:border-sky-700
          py-1 pl-3 pr-6
          border-gray-300
          bg-transparent
          text-gray-500
          text-sm
          rounded-md
        "
        name="item-per-page"
      >
        <option
          v-for="option in paginationOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, watch, nextTick, useSlots, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/solid'
import { CloudIcon } from '@heroicons/vue/outline'
import { config } from '@/config'
import Pagination from '@/components/default/Pagination.vue'
import { useSearch } from '@/composables/use-search'
import { TableColumn } from '@/typings/table.type'

interface Props {
  name?: string
  height?: number
  columns: TableColumn[]
  items: T[]
  total: number
  loading: boolean
  hasPagination?: boolean
  hasSearch?: boolean
  hasSelection?: boolean
  hasEdit?: boolean
  hasDelete?: boolean
  isClickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Data',
  height: 0,
  hasPagination: true,
  hasSearch: true,
  hasEdit: true,
  hasDelete: true
})
const emit = defineEmits([
  'search',
  'selection',
  'detail',
  'delete',
  'edit',
  'rowClick'
])

const slots = useSlots()
const router = useRouter()
const { pagination, sort } = useSearch(emit, router)

const paginationOptions = ref(config.paginationOptions)

const tableStyle = computed(() => ({ minHeight: `${props.height}px` }))
const hasItems = computed(() => props.items && props.items.length > 0)
const isDeep = (e: string) => {
  return e.includes('.')
}

const filterColumns = computed(() =>
  props.columns.filter((column) => !column.isHidden)
)
watch(
  () => filterColumns,
  (val) => {
    nextTick(() => setSort(val.value[0], 'desc'))
  },
  { immediate: true }
)

const getSortingComponent = (column: TableColumn) => {
  if (!column.isSortable) return ''
  if (column.key === sort.by) {
    if (sort.direction === 'asc') {
      return 'ArrowSmDownIcon'
    }
    return 'ArrowSmUpIcon'
  }
  return 'SwitchVerticalIcon'
}

const setSort = (column: TableColumn, direction = 'asc') => {
  if (column.isSortable) {
    sort.by = column.key
    if (direction) {
      sort.direction = direction
    } else {
      if (sort.by === column.key && sort.direction === 'asc') {
        sort.direction = 'asc'
      } else {
        sort.direction = 'desc'
      }
    }

    // reset to page 1
    pagination.page = 1
  }
}

const onSelectionInput = (selection) => {
  emit('selection', selection.target.checked)
}

const onEdit = (item) => {
  emit('edit', item)
}

const onDelete = (item) => {
  emit('delete', item)
}

const hasDetail = computed(() => !!slots.detail)
const isDetailOpens: Ref<boolean[]> = ref([])
const onToogleDetail = (index, item) => {
  isDetailOpens[index] = !isDetailOpens[index]
  emit('detail', isDetailOpens[index], index, item)
}

const getValue = (obj, path) => {
  if (!path) return obj
  const properties = path.split('.')
  return getValue(obj[properties.shift()], properties.join('.'))
}

const onRowClick = (item) => {
  emit('rowClick', item)
}
</script>

<style lang="scss" scoped>
.head {
  @apply px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap;

  &.action {
    @apply text-center w-1;
  }
}
</style>
