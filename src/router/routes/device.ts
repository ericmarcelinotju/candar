export const deviceList = {
  path: '/device',
  name: 'device',
  component: () => import(/* webpackChunkName: 'p-device-list' */ '@/pages/device/List.vue'),
  meta: {
    auth: true,
    title: 'Device'
  }
}

const DeviceCreateEdit = () => import(/* webpackChunkName: 'p-device-create-edit' */ '@/pages/device/CreateEdit.vue')

export const deviceCreate = {
  path: '/device/create',
  name: 'device-create',
  component: DeviceCreateEdit,
  meta: {
    auth: true,
    title: 'Device Create'
  }
}

export const deviceEdit = {
  path: '/device/edit/:id',
  name: 'device-edit',
  component: DeviceCreateEdit,
  meta: {
    auth: true,
    title: 'Device Edit'
  }
}
