export const inspectionList = {
  path: '/inspection',
  name: 'inspection',
  component: () => import(/* webpackChunkName: 'p-inspection-list' */ '@/pages/inspection/List.vue'),
  meta: {
    auth: true,
    title: 'Role'
  }
}

const InspectionCreateEdit = () => import(/* webpackChunkName: 'p-inspection-create-edit' */ '@/pages/inspection/CreateEdit.vue')

export const inspectionCreate = {
  path: '/inspection/create',
  name: 'inspection-create',
  component: InspectionCreateEdit,
  meta: {
    auth: true,
    title: 'Inspection Create'
  }
}

export const inspectionEdit = {
  path: '/inspection/edit/:id',
  name: 'inspection-edit',
  component: InspectionCreateEdit,
  meta: {
    auth: true,
    title: 'Inspection Edit'
  }
}

export const inspectionDetail = {
  path: '/inspection/detail/:id',
  name: 'inspection-detail',
  component: () => import(/* webpackChunkName: 'p-inspection-detail' */ '@/pages/inspection/Detail.vue'),
  meta: {
    auth: true,
    title: 'Inspection Detail'
  }
}
