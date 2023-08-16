import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Inspection, InspectionList } from '@/typings/models/inspection.type'
import { DeviceInspection } from '@/typings/models/deviceInspection.type'

const get = (filter?: Inspection): Promise<BaseResponse<InspectionList>> => {
  return axios.get(`/inspection${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Inspection>> => {
  return axios.get(`/inspection/${id}`)
}

const insert = (data: Inspection): Promise<BaseResponse<null>> => {
  return axios.post('/inspection', data)
}

const update = (id: string, data: Inspection): Promise<BaseResponse<null>> => {
  return axios.put(`/inspection/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/inspection/${id}`)
}

const doInspection = (id: string, data: DeviceInspection[]): Promise<BaseResponse<null>> => {
  return axios.post(`/inspection/do/${id}`, { device_inspections: data })
}

export {
  get,
  detail,
  insert,
  update,
  del,
  doInspection
}
