import { serializeQueryParams } from '@/utils'
import axios from './index'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Permission } from '@/typings/models/permission.type'

const get = (filter?: Permission): Promise<BaseResponse<ListResponse<Permission>>> => {
  return axios.get(`/permission${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Permission>> => {
  return axios.get(`/permission/${id}`)
}

const insert = (data: Permission): Promise<BaseResponse<null>> => {
  return axios.post('/permission', data)
}

const update = (id: string, data: Permission): Promise<BaseResponse<null>> => {
  return axios.put(`/permission/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/permission${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
