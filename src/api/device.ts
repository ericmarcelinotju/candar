import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Device, DeviceList } from '@/typings/models/device.type'

const get = (filter?: Device): Promise<BaseResponse<DeviceList>> => {
  return axios.get(`/device${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Device>> => {
  return axios.get(`/device/${id}`)
}

const insert = (data: Device): Promise<BaseResponse<null>> => {
  return axios.post('/device', data)
}

const update = (id: string, data: Device): Promise<BaseResponse<null>> => {
  return axios.put(`/device/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/device${id}`)
}

const sync = (): Promise<BaseResponse<null>> => {
  return axios.get('/fetch')
}

export {
  get,
  detail,
  insert,
  update,
  del,
  sync
}
