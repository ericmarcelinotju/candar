export const projectList = {
  path: '/deal',
  name: 'deal',
  component: () =>
    import(/* webpackChunkName: 'p-project-list' */ '@/pages/project/List.vue'),
  meta: {
    auth: true,
    title: 'Deal'
  }
}

const projectCreateEdit = () =>
  import(
    /* webpackChunkName: 'p-project-create-edit' */ '@/pages/project/CreateEdit.vue'
  )

export const projectCreate = {
  path: '/deal/create',
  name: 'deal-create',
  component: projectCreateEdit,
  meta: {
    auth: true,
    title: 'Create Deal'
  }
}

export const projectEdit = {
  path: '/deal/edit/:id',
  name: 'deal-edit',
  component: projectCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Deal'
  }
}
