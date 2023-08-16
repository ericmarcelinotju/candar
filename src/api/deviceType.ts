import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { DeviceType, DeviceTypeList } from '@/typings/models/deviceType.type'

const get = (filter?: DeviceType): Promise<BaseResponse<DeviceTypeList>> => {
  return axios.get(`/device-type${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<DeviceType>> => {
  return axios.get(`/device-type/${id}`)
}

const insert = (data: DeviceType): Promise<BaseResponse<null>> => {
  return axios.post('/device-type', data)
}

const update = (id: string, data: DeviceType): Promise<BaseResponse<null>> => {
  return axios.put(`/device-type/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/device-type/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
