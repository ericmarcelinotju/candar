import { TableColumn } from '@/typings/table.type'

const defaultUserColumns: TableColumn[] = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Username',
    key: 'username',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Email',
    key: 'email',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Role',
    key: 'role'
  },
  {
    label: 'Role',
    key: 'roleId',
    isHidden: true,
    isSearchable: true,
    options: [],
    type: 'dropdown'
  },
  {
    label: 'Division',
    key: 'division'
  }
]

const defaultDeviceColumns: TableColumn[] = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Serial Number',
    key: 'serial_number',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Address',
    key: 'address',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Tag',
    key: 'tag'
  },
  {
    label: 'Type',
    key: 'type_id',
    isSearchable: true,
    type: 'dropdown'
  },
  {
    label: 'Location',
    key: 'location_id',
    isSearchable: true,
    type: 'dropdown'
  },
  {
    label: 'Last Checked',
    key: 'last_checked'
  }
]

const defaultDeviceTypeColumns: TableColumn[] = [
  {
    label: 'ID',
    key: 'id',
    isHidden: true
  },
  {
    label: 'Name',
    key: 'name',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Category',
    key: 'category',
    isSortable: true,
    isSearchable: true
  },
  {
    label: 'Description',
    key: 'description'
  }
]

const state = () => ({
  userColumns: defaultUserColumns,
  deviceColumns: defaultDeviceColumns,
  deviceTypeColumns: defaultDeviceTypeColumns
})

const getters = {
  user(state) {
    return state.userColumns || []
  },
  device(state) {
    return state.deviceColumns || []
  },
  deviceType(state) {
    return state.deviceTypeColumns || []
  }
}

const mutations = {
  setUser(state, value) {
    state.userColumns = [...value]
  },
  setDefaultUser(state) {
    state.userColumns = defaultUserColumns
  },
  setDevice(state, value) {
    state.deviceColumns = [...value]
  },
  setDefaultDevice(state) {
    state.deviceColumns = defaultDeviceColumns
  },
  setDeviceType(state, value) {
    state.deviceTypeColumns = [...value]
  },
  setDefaultDeviceType(state) {
    state.deviceTypeColumns = defaultDeviceTypeColumns
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
