<template>
  <div class="bg-white flex items-center justify-between">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        class="
          relative
          inline-flex
          items-center
          px-3
          py-1
          border border-gray-300
          text-sm
          font-medium
          text-gray-900
          bg-white
          hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          rounded-l-md
        "
        :disabled="!hasPrev"
        @click.prevent="changePage(prevPage)"
      >
        Prev
      </button>
      <button
        class="
          relative
          inline-flex
          items-center
          px-3
          py-1
          border border-gray-300
          text-sm
          font-medium
          text-gray-900
          bg-white
          hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          rounded-r-md
        "
        :disabled="!hasNext"
        @click.prevent="changePage(nextPage)"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <nav
          aria-label="Pagination"
          class="relative z-0 inline-flex shadow-sm -space-x-px"
        >
          <button
            class="
              relative
              inline-flex
              items-center
              px-1
              py-1
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
              disabled:opacity-50 disabled:cursor-not-allowed
              rounded-l-md
            "
            :disabled="!hasPrev"
            @click.prevent="changePage(prevPage)"
          >
            <span class="sr-only">
              {{ $t("app.components.pagination.previous") }}
            </span>
            <ChevronLeftIcon
              aria-hidden="true"
              class="h-5 w-5"
            />
          </button>
          <a
            v-if="hasFirst"
            class="
              bg-white
              border-gray-300
              text-gray-500
              hover:bg-gray-50
              relative
              inline-flex
              items-center
              px-3
              py-1
              border
              text-sm
              font-medium
            "
            href="#"
            @click.prevent="changePage(1)"
          >
            1
          </a>
          <span
            v-if="hasFirst"
            class="
              relative
              inline-flex
              items-center
              px-3
              py-1
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-900
            "
          >
            ...
          </span>
          <a
            v-for="page in pages"
            :key="page"
            :class="[
              {
                'z-10 bg-sky-50 border-sky-500 text-sky-600': current == page,
              },
              'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-3 py-1 border text-sm font-medium',
            ]"
            href="#"
            @click.prevent="changePage(page)"
          >
            {{ page }}
          </a>
          <span
            v-if="hasLast"
            class="
              relative
              inline-flex
              items-center
              px-3
              py-1
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-900
            "
          >
            ...
          </span>
          <a
            v-if="hasLast"
            class="
              bg-white
              border-gray-300
              text-gray-500
              hover:bg-gray-50
              relative
              inline-flex
              items-center
              px-3
              py-1
              border
              text-sm
              font-medium
            "
            href="#"
            @click.prevent="changePage(totalPages)"
          >
            {{ totalPages }}
          </a>
          <button
            class="
              relative
              inline-flex
              items-center
              px-1
              py-1
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
              disabled:opacity-50 disabled:cursor-not-allowed
              rounded-r-md
            "
            :disabled="!hasNext"
            @click.prevent="changePage(nextPage)"
          >
            <span class="sr-only">
              {{ $t("app.components.pagination.next") }}
            </span>
            <ChevronRightIcon
              aria-hidden="true"
              class="h-5 w-5"
            />
          </button>
        </nav>
      </div>
      <div class="ml-4">
        <div class="my-3 flex justify-between items-end">
          <p class="text-sm text-gray-500">
            {{ $t("app.components.table.showingData", { count: total }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

const props = defineProps({
  current: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  currentTotal: {
    type: Number,
    default: 0
  },
  perPage: {
    type: Number,
    default: 10
  },
  pageRange: {
    type: Number,
    default: 2
  },
  textBeforeInput: {
    type: String,
    default: 'Go to page'
  },
  textAfterInput: {
    type: String,
    default: 'Go'
  }
})
const emit = defineEmits(['page-changed'])

const pages = computed(() => {
  const pages = []
  for (let i = rangeStart.value; i <= rangeEnd.value; i++) {
    pages.push(i)
  }
  return pages
})

const rangeStart = computed(() => {
  const start = props.current - props.pageRange
  return (start > 0) ? start : 1
})
const rangeEnd = computed(() => {
  const end = props.current + props.pageRange
  return (end < totalPages.value) ? end : totalPages.value
})

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const nextPage = computed(() => props.current + 1)
const prevPage = computed(() => props.current - 1)

const hasFirst = computed(() => rangeStart.value !== 1)
const hasLast = computed(() => rangeEnd.value < totalPages.value)
const hasPrev = computed(() => props.current > 1)
const hasNext = computed(() => props.current < totalPages.value)

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    emit('page-changed', page)
  }
}
</script>
