export const projectList = {
  path: '/project',
  name: 'project',
  component: () => import(/* webpackChunkName: 'p-project-list' */ '@/pages/project/List.vue'),
  meta: {
    auth: true,
    title: 'project'
  }
}

const projectCreateEdit = () => import(/* webpackChunkName: 'p-project-create-edit' */ '@/pages/project/CreateEdit.vue')

export const projectCreate = {
  path: '/project/create',
  name: 'project-create',
  component: projectCreateEdit,
  meta: {
    auth: true,
    title: 'project Create'
  }
}

export const projectEdit = {
  path: '/project/edit/:id',
  name: 'project-edit',
  component: projectCreateEdit,
  meta: {
    auth: true,
    title: 'project Edit'
  }
}
