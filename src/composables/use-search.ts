import { onMounted, Ref, ref, reactive, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash'
import { config } from '@/config'

const pagination = reactive({
  page: 1,
  limit: config.paginationOptions[0]
})

const sort = reactive({
  by: undefined,
  direction: undefined
})

const updateQuery = (router, params, replace = true) => {
  const data = {
    query: {
      ...params
    }
  }
  if (replace) {
    router.replace(data).catch((e) => { console.log(e) })
    return
  }
  router.push(data).catch((e) => { console.log(e) })
}

const useSearch = (emit, router) => {
  const route = useRoute()

  const queryParams: Ref<{[key: string]: string}> = ref({})

  const checkRouteQuery = () => {
    let page = 1
    if (route.query.page && typeof route.query.page === 'string') {
      page = parseInt(route.query.page)
    }
    pagination.page = page

    let limit = config.paginationOptions[0]
    if (route.query.limit && typeof route.query.limit === 'string') {
      limit = parseInt(route.query.limit)
    }
    pagination.limit = limit

    let sortBy
    let sortDirection = 'asc'
    if (route.query.sort && typeof route.query.sort === 'string' && route.query.sort.includes(':')) {
      const sort = route.query.sort.split(':')
      if (sort[0].length > 0) {
        sortBy = sort[0]
      }
      if (sort[1] === 'asc' || sort[1] === 'desc') {
        sortDirection = sort[1]
      }
    }
    sort.by = sortBy
    sort.direction = sortDirection

    for (const key in route.query) {
      if (key === 'page' || key === 'limit' || key === 'sort') {
        continue
      }
      const param = route.query[key]
      if (param !== null && param !== undefined) {
        const paramStr = param.toString()
        if (paramStr.length > 0) {
          queryParams.value[key] = paramStr
        }
      }
    }
  }

  const onQueryChange = (isSubmit = true) => debounce(() => {
    // Filter out empty values from parameters
    const filteredParams = {}
    for (const key in queryParams.value) {
      if (key === 'page' || key === 'limit' || key === 'sort') {
        continue
      }
      const param = queryParams.value[key]
      if (param !== null && param !== undefined) {
        const paramStr = param.toString()
        if (paramStr.length > 0) {
          filteredParams[key] = paramStr
        }
      }
    }

    // Combine parameters with pagination and sort
    const searchParams = {
      page: pagination.page,
      limit: pagination.limit,
      sort: '',
      ...filteredParams
    }
    if (sort.by && sort.by.length > 0) {
      searchParams.sort = `${sort.by}:${sort.direction}`
    }

    if (isSubmit) {
      updateQuery(router, searchParams)
      emit('search', searchParams)
    }
  })

  watch([pagination, sort], onQueryChange())
  watch(queryParams, onQueryChange(false))

  const initSearch = (defaultParams) => {
    queryParams.value = {
      ...defaultParams,
      ...queryParams
    }
  }

  const resetSearch = () => {
    for (const key in queryParams.value) {
      queryParams.value[key] = null
    }

    Object.assign(pagination, {
      page: 1,
      limit: config.paginationOptions[0]
    })

    Object.assign(sort, {
      by: undefined,
      direction: undefined
    })
  }

  onMounted(() => {
    checkRouteQuery()
  })

  onBeforeUnmount(() => {
    resetSearch()
  })

  return {
    pagination,
    sort,
    queryParams,
    initSearch,
    resetSearch,
    submitSearch: onQueryChange()
  }
}

export {
  useSearch
}
