export const deviceTypeList = {
  path: '/device/type',
  name: 'device-type',
  component: () => import(/* webpackChunkName: 'p-deviceType-list' */ '@/pages/deviceType/List.vue'),
  meta: {
    auth: true,
    title: 'Device Type'
  }
}

const DeviceTypeCreateEdit = () => import(/* webpackChunkName: 'p-deviceType-create-edit' */ '@/pages/deviceType/CreateEdit.vue')

export const deviceTypeCreate = {
  path: '/device/type/create',
  name: 'device-type-create',
  component: DeviceTypeCreateEdit,
  meta: {
    auth: true,
    title: 'Device Type Create'
  }
}

export const deviceTypeEdit = {
  path: '/device/type/edit/:id',
  name: 'device-type-edit',
  component: DeviceTypeCreateEdit,
  meta: {
    auth: true,
    title: 'Device Type Edit'
  }
}
