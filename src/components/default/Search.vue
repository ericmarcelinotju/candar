<template>
  <div class="flex h-full">
    <div
      v-if="hasSearchableColumns"
      class="inset-y-0 left-0 flex items-center"
    >
      <label
        class="sr-only"
        for="search"
      >
        {{ $t("app.components.search.searchTypeLabel") }}
      </label>
      <select
        id="search"
        v-model="selectedColumnKey"
        autocomplete="search"
        class="
          focus:ring-info
          w-32
          focus:border-info
          h-full
          py-0
          pl-3
          pr-7
          border-transparent
          bg-gray-100
          text-gray-500 text-sm
          rounded-l-md
        "
        name="search"
      >
        <option
          v-for="column in searchableColumns"
          :key="column.key"
          :value="column.key"
        >
          {{ column.label }}
        </option>
      </select>
    </div>
    <div
      :class="[
        {
          'border-l-2 border-gray-300 bg-gray-100 w-72 rounded-r-md overflow-hidden': hasSearchableColumns,
        },
        'relative',
      ]"
    >
      <div
        class="
          absolute
          inset-y-0
          left-0
          pl-3
          flex
          items-center
          pointer-events-none
        "
      >
        <SearchIcon
          aria-hidden="true"
          class="h-5 w-5 text-gray-400"
        />
      </div>
      <InputDropdown
        v-if="selectedColumn && selectedColumn.type === 'dropdown'"
        v-model="searchQuery"
        class="pl-12"
        class-name="text-left w-full py-2 sm:text-sm border-transparent bg-gray-100 block"
        :options="options"
        type="list"
        @input="search"
      />
      <Datepicker
        v-else-if="selectedColumn && selectedColumn.type === 'date-range'"
        v-model="searchQuery"
        auto-apply
        :clearable="false"
        :enable-time-picker="false"
        input-class-name="search-datepicker"
        range
        @update:model-value="search"
      />
      <Datepicker
        v-else-if="selectedColumn && selectedColumn.type === 'date'"
        v-model="searchQuery"
        auto-apply
        :clearable="false"
        :enable-time-picker="false"
        input-class-name="search-datepicker"
        @update:model-value="search"
      />
      <div v-else>
        <input
          id="search"
          v-model="searchQuery"
          class="
            focus:ring-info focus:border-info
            w-full
            pl-12
            sm:text-sm
            border-transparent
            bg-gray-100
            block
          "
          name="search"
          placeholder="Search"
          type="text"
          @keyup.enter="search"
        >
        <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd
            class="
              inline-flex
              items-center
              border border-gray-200
              rounded
              px-2
              text-sm
              font-sans font-medium
              text-gray-400
              hover:bg-info hover:text-white hover:cursor-pointer
            "
            :disabled="loading"
            @click="search"
          >
            <Loading
              v-if="loading"
              class="w-3 h-3"
            />
            <span v-else>⌘</span>
            &nbsp;{{ $t("app.components.search.confirm") }}
          </kbd>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SearchIcon } from '@heroicons/vue/solid'
import { useSearch } from '@/composables/use-search'
import Datepicker from '@vuepic/vue-datepicker'
import Loading from '@/components/helper/Loading.vue'
import InputDropdown from '@/components/form/dropdown/Dropdown.vue'
import { TableColumn } from '@/typings/table.type'

interface Props {
  columns: TableColumn[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['search'])

const router = useRouter()

const selectedColumnKey = ref('')
const selectedColumn = computed(() => props.columns.find(column => column.key === selectedColumnKey.value))
const options = computed(() => selectedColumn.value?.options)

const searchQuery = ref(null)

const { submitSearch, queryParams, pagination } = useSearch(emit, router)

const searchableColumns = computed(() => props.columns.filter(field => field.isSearchable))
const hasSearchableColumns = computed(() => searchableColumns.value && searchableColumns.value.length > 0)

const initPage = () => {
  const key = Object.keys(queryParams.value).find(key => key !== 'page' && key !== 'limit' && key !== 'sort')
  selectedColumnKey.value = key
}

const search = () => {
  // TODO :: reset pagination
  pagination.page = 1

  const search = {}
  search[selectedColumnKey.value] = searchQuery.value
  queryParams.value = search
  submitSearch()
}

watch(selectedColumn, (val) => {
  if (val) {
    searchQuery.value = queryParams.value[val.key]
  }
})

onMounted(() => {
  initPage()
})
</script>
